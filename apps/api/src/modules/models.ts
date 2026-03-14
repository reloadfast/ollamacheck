import { FastifyReply, FastifyRequest } from 'fastify';
import { sqliteDb } from '../db';
import { z } from 'zod';
import { modelSchema, categorySchema } from '@ollamacheck/shared/src/schema';

// Mock data for now - in a real implementation, this would fetch from the database
const mockModels = [
  {
    id: "1",
    slug: "qwen2.5-coder-32b-instruct-q4-k-m",
    name: "Qwen2.5 Coder",
    tag: "qwen2.5-coder:32b-instruct-q4_K_M",
    paramsBillions: 32,
    quantization: "Q4_K_M",
    estimatedVramGb: 18,
    weeklyPulls: 100000,
    fitScore: 100000,
    pullCommand: "ollama pull qwen2.5-coder:32b-instruct-q4_K_M",
    lastScrapedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: "2",
    slug: "mistral-7b-instruct-q4-k-m",
    name: "Mistral",
    tag: "mistral:7b-instruct-q4_K_M",
    paramsBillions: 7,
    quantization: "Q4_K_M",
    estimatedVramGb: 4.2,
    weeklyPulls: 75000,
    fitScore: 75000,
    pullCommand: "ollama pull mistral:7b-instruct-q4_K_M",
    lastScrapedAt: new Date(),
    createdAt: new Date()
  }
];

const mockCategories = [
  {
    id: "1",
    slug: "code",
    label: "Code Agents",
    description: "Models optimized for code generation and tool use",
    icon: "💻"
  },
  {
    id: "2",
    slug: "vision",
    label: "Vision",
    description: "Models for image and vision tasks",
    icon: "👁️"
  }
];

// Get paginated models with filters
export async function getModels(request: FastifyRequest, reply: FastifyReply) {
  try {
    const {
      category = 'code',
      sort = 'fitScore',
      limit = 20,
      page = 1
    } = request.query as any;

    // In a real implementation, we would:
    // 1. Query the database with filters
    // 2. Apply sorting
    // 3. Paginate results

    // For now, return mock data
    const models = mockModels;

    const total = models.length;
    const totalPages = Math.ceil(total / limit);

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedModels = models.slice(startIndex, endIndex);

    return {
      data: paginatedModels,
      meta: {
        total,
        page,
        limit,
        lastUpdatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching models:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// Get model by slug
export async function getModelBySlug(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { slug } = request.params as any;

    // In a real implementation:
    // 1. Query database for the specific model
    // 2. Return the model or 404 if not found

    // For now, return mock data
    const model = mockModels.find(m => m.slug === slug);

    if (!model) {
      return reply.status(404).send({ error: 'Model not found' });
    }

    return { data: model };
  } catch (error) {
    console.error('Error fetching model:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}