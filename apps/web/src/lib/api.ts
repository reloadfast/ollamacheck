import { Model } from '@ollamacheck/shared/src/schema';

// Base URL for the API - should be configurable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API client functions
export const apiClient = {
  // Fetch models with pagination and filters
  getModels: async (params: {
    category?: string;
    sort?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: Model[]; meta: any }> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/models?${searchParams}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Fetch a single model by slug
  getModelBySlug: async (slug: string): Promise<{ data: Model }> => {
    const response = await fetch(`${API_BASE_URL}/api/models/${slug}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Fetch categories
  getCategories: async (): Promise<{ data: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/api/categories`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get scrape status
  getScrapeStatus: async (): Promise<{ data: any }> => {
    const response = await fetch(`${API_BASE_URL}/api/scrape/status`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Trigger manual scrape
  triggerScrape: async (): Promise<{ message: string; modelsProcessed: number }> => {
    const response = await fetch(`${API_BASE_URL}/api/scrape/trigger`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};