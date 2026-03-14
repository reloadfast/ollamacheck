import { z } from 'zod';

// Shared Zod schemas for the application

export const modelSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tag: z.string(),
  paramsBillions: z.number(),
  quantization: z.string(),
  estimatedVramGb: z.number(),
  weeklyPulls: z.number(),
  fitScore: z.number(),
  pullCommand: z.string(),
  lastScrapedAt: z.date(),
  createdAt: z.date(),
});

export type Model = z.infer<typeof modelSchema>;

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  label: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const modelCategorySchema = z.object({
  modelId: z.string(),
  categoryId: z.string(),
});

export type ModelCategory = z.infer<typeof modelCategorySchema>;

export const scrapeRunSchema = z.object({
  id: z.string(),
  startedAt: z.date(),
  finishedAt: z.date().nullable(),
  modelsProcessed: z.number(),
  status: z.enum(['pending', 'success', 'failed']),
  errorMessage: z.string().nullable(),
});

export type ScrapeRun = z.infer<typeof scrapeRunSchema>;

// Export all schemas for easy access
export const schemas = {
  model: modelSchema,
  category: categorySchema,
  modelCategory: modelCategorySchema,
  scrapeRun: scrapeRunSchema,
};