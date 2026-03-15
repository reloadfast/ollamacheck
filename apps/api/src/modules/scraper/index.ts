import { sqliteDb } from '../../db';
import { scrapeRunSchema, modelSchema } from '@ollamacheck/shared/src/schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import { estimateVramGb, calculateFitScore } from './utils';

// Types for scraper data
export interface BaseModel {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  paramsBillions: number;
  lastUpdated: Date;
}

export interface ModelVariant {
  tag: string;
  quantization: string;
  size: number; // in GB
  downloadCount: number;
  lastUpdated?: Date;
}

export interface ProviderModel extends BaseModel {
  variants: ModelVariant[];
}

export interface DataProvider {
  name: string;
  getModels(): Promise<ProviderModel[]>;
  getModelByTag(tag: string): Promise<ProviderModel | null>;
}

// Base provider class
export abstract class BaseDataProvider implements DataProvider {
  abstract name: string;

  abstract getModels(): Promise<ProviderModel[]>;
  abstract getModelByTag(tag: string): Promise<ProviderModel | null>;
}

// OllamaDB provider (primary source)
export class OllamaDBProvider extends BaseDataProvider {
  name = 'ollamadb';
  private baseUrl = 'https://ollamadb.dev/api/v1';

  async getModels(): Promise<ProviderModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Convert API response to our model format
      return data.models.map((model: any) => ({
        id: model.id,
        name: model.name,
        description: model.description,
        tags: model.tags || [],
        paramsBillions: model.params_billions,
        lastUpdated: new Date(model.last_updated),
        variants: (model.variants || []).map((variant: any) => ({
          tag: variant.tag,
          quantization: variant.quantization,
          size: variant.size_gb,
          downloadCount: variant.downloads || 0,
          lastUpdated: variant.last_updated ? new Date(variant.last_updated) : undefined
        }))
      }));
    } catch (error) {
      console.error('Error fetching from OllamaDB:', error);
      throw error;
    }
  }

  async getModelByTag(tag: string): Promise<ProviderModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${tag}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        tags: data.tags || [],
        paramsBillions: data.params_billions,
        lastUpdated: new Date(data.last_updated),
        variants: (data.variants || []).map((variant: any) => ({
          tag: variant.tag,
          quantization: variant.quantization,
          size: variant.size_gb,
          downloadCount: variant.downloads || 0,
          lastUpdated: variant.last_updated ? new Date(variant.last_updated) : undefined
        }))
      };
    } catch (error) {
      console.error('Error fetching model by tag from OllamaDB:', error);
      throw error;
    }
  }
}

// OCI Registry provider (fallback source)
export class OCIRegistryProvider extends BaseDataProvider {
  name = 'oci-registry';
  private baseUrl = 'https://registry.ollama.ai';

  async getModels(): Promise<ProviderModel[]> {
    // For now, this is a placeholder - in practice, you'd need to implement
    // the actual logic to fetch models from OCI registry
    console.warn('OCI Registry provider not fully implemented');
    return [];
  }

  async getModelByTag(tag: string): Promise<ProviderModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/${tag.split(':')[0]}/manifests/${tag.split(':')[1]}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the manifest to get layer sizes for VRAM calculation
      const manifest = await response.json();

      // This is a simplified implementation - real implementation would parse
      // the actual layers and calculate accurate VRAM requirements
      return {
        id: tag,
        name: tag.split(':')[0],
        tags: ['oci'],
        paramsBillions: 0, // Would be calculated from manifest
        lastUpdated: new Date(),
        variants: [{
          tag,
          quantization: 'Q4_K_M', // Default assumption
          size: 10, // Placeholder - would be accurate in real implementation
          downloadCount: 0,
        }]
      };
    } catch (error) {
      console.error('Error fetching model by tag from OCI Registry:', error);
      throw error;
    }
  }
}

// HTML scraper provider (last resort)
export class HTMLScraperProvider extends BaseDataProvider {
  name = 'html-scraper';
  private baseUrl = 'https://ollama.com/search';

  async getModels(): Promise<ProviderModel[]> {
    console.warn('Using HTML scraper - this is the last resort method');

    // This would implement actual scraping logic
    // For now, returning mock data to demonstrate structure
    return [
      {
        id: 'mock-model-1',
        name: 'Mock Model 1',
        tags: ['code', 'programming'],
        paramsBillions: 7,
        lastUpdated: new Date(),
        variants: [{
          tag: 'mock-model-1:7b-instruct-q4_K_M',
          quantization: 'Q4_K_M',
          size: 4.2,
          downloadCount: 50000,
        }]
      }
    ];
  }

  async getModelByTag(tag: string): Promise<ProviderModel | null> {
    console.warn('Using HTML scraper for single model - this is the last resort method');

    // This would implement actual scraping logic
    return {
      id: tag,
      name: tag.split(':')[0],
      tags: ['scraped'],
      paramsBillions: 7,
      lastUpdated: new Date(),
      variants: [{
        tag,
        quantization: 'Q4_K_M',
        size: 4.2,
        downloadCount: 50000,
      }]
    };
  }
}

// Main scraper orchestrator
export class ModelScraper {
  private providers: DataProvider[];
  private currentProviderIndex = 0;

  constructor() {
    this.providers = [
      new OllamaDBProvider(),
      new OCIRegistryProvider(),
      new HTMLScraperProvider()
    ];
  }

  // Try to get models from providers in priority order
  async getModels(): Promise<ProviderModel[]> {
    for (const provider of this.providers) {
      try {
        console.log(`Attempting to fetch models from ${provider.name}...`);
        const models = await provider.getModels();
        if (models && models.length > 0) {
          console.log(`Successfully fetched ${models.length} models from ${provider.name}`);
          return models;
        }
      } catch (error) {
        console.warn(`Failed to fetch models from ${provider.name}:`, error);
        continue;
      }
    }

    // If all providers fail, return empty array or throw an error
    console.error('All data providers failed to provide models');
    return [];
  }

  // Try to get a specific model by tag from providers in priority order
  async getModelByTag(tag: string): Promise<ProviderModel | null> {
    for (const provider of this.providers) {
      try {
        console.log(`Attempting to fetch model ${tag} from ${provider.name}...`);
        const model = await provider.getModelByTag(tag);
        if (model) {
          console.log(`Successfully fetched model ${tag} from ${provider.name}`);
          return model;
        }
      } catch (error) {
        console.warn(`Failed to fetch model ${tag} from ${provider.name}:`, error);
        continue;
      }
    }

    console.error(`All data providers failed to provide model ${tag}`);
    return null;
  }

  // VRAM estimation function
  estimateVramGb(paramsBillions: number, bitsPerWeight: number = 4): number {
    return estimateVramGb(paramsBillions, bitsPerWeight);
  }

  // Fit score calculation function
  calculateFitScore(
    estimatedVramGb: number,
    weeklyPulls: number,
    isCodeModel: boolean = false
  ): number {
    return calculateFitScore(estimatedVramGb, weeklyPulls, isCodeModel);
  }

  // Main scraping function that processes all models
  async scrapeOllamaModels(): Promise<ModelCandidate[]> {
    const scrapeRunId = uuidv4();

    try {
      console.log('Starting Ollama models scraping. ..');

      // Create a new scrape run record
      await sqliteDb.insert(scrapeRunSchema).values({
        id: scrapeRunId,
        startedAt: new Date(),
        finishedAt: null,
        modelsProcessed: 0,
        status: 'pending',
        errorMessage: null,
      });

      // Get models from providers
      const allModels = await this.getModels();

      const candidates: ModelCandidate[] = [];

      for (const model of allModels) {
        // Find the best variant that fits within 38GB VRAM (40GB with 2GB headroom)
        const fittingVariants = model.variants.filter(variant => {
          const vramGb = this.estimateVramGb(model.paramsBillions,
            variant.quantization === 'Q8_0' ? 8 : 4);
          return vramGb <= 38; // 38GB to leave 2GB headroom
        });

        if (fittingVariants.length > 0) {
          // Select the best variant (prefer Q4_K_M over Q8_0 for smaller size)
          const bestVariant = fittingVariants.reduce((prev, current) => {
            return (prev.quantization === 'Q4_K_M' && current.quantization !== 'Q4_K_M')
              ? prev
              : (current.size < prev.size) ? current : prev;
          });

          // Determine if this is a code model based on tags
          const isCodeModel = model.tags.some(tag =>
            ['code', 'programming', 'tool-use'].includes(tag)
          );

          const estimatedVramGb = this.estimateVramGb(model.paramsBillions,
            bestVariant.quantization === 'Q8_0' ? 8 : 4);

          const fitScore = this.calculateFitScore(estimatedVramGb, bestVariant.downloadCount, isCodeModel);

          candidates.push({
            id: uuidv4(),
            slug: model.name.toLowerCase().replace(/\s+/g, '-'),
            name: model.name,
            tag: bestVariant.tag,
            paramsBillions: model.paramsBillions,
            quantization: bestVariant.quantization,
            estimatedVramGb,
            weeklyPulls: bestVariant.downloadCount,
            fitScore,
            pullCommand: `ollama pull ${bestVariant.tag}`,
            lastScrapedAt: new Date(),
            createdAt: new Date(),
          });
        }
      }

      console.log(`Found ${candidates.length} fitting models`);

      // Update scrape run with results
      await sqliteDb.update(scrapeRunSchema).set({
        finishedAt: new Date(),
        modelsProcessed: candidates.length,
        status: 'success',
      }).where(scrapeRunSchema.id.eq(scrapeRunId));

      return candidates;
    } catch (error) {
      console.error('Error scraping Ollama models:', error);

      // Update scrape run with error
      await sqliteDb.update(scrapeRunSchema).set({
        finishedAt: new Date(),
        status: 'failed',
        errorMessage: (error as Error).message,
      }).where(scrapeRunSchema.id.eq(scrapeRunId));

      throw error;
    }
  }
}

// Export the main scraper instance
export const modelScraper = new ModelScraper();

// Export for use in other modules
export { BaseModel, ModelVariant, ProviderModel, DataProvider };
