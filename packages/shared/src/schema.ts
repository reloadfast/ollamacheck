import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Database schema definitions for Drizzle ORM

export const models = sqliteTable('models', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tag: text('tag').notNull(),
  paramsBillions: integer('params_billions').notNull(),
  quantization: text('quantization').notNull(),
  estimatedVramGb: integer('estimated_vram_gb').notNull(),
  weeklyPulls: integer('weekly_pulls').notNull().default(0),
  fitScore: integer('fit_score').notNull().default(0),
  pullCommand: text('pull_command').notNull(),
  lastScrapedAt: text('last_scraped_at').notNull(),
  createdAt: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
});

export const modelCategories = sqliteTable('model_categories', {
  modelId: text('model_id')
    .notNull()
    .references(() => models.id),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
});

// Relations
export const modelsRelations = relations(models, ({ many }) => ({
  modelCategories: many(modelCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  modelCategories: many(modelCategories),
}));

export const modelCategoriesRelations = relations(modelCategories, ({ one }) => ({
  model: one(models, {
    fields: [modelCategories.modelId],
    references: [models.id],
  }),
  category: one(categories, {
    fields: [modelCategories.categoryId],
    references: [categories.id],
  }),
}));

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

// Data provider interfaces
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

// Export all schemas for easy access
export const schemas = {
  model: modelSchema,
  category: categorySchema,
  modelCategory: modelCategorySchema,
  scrapeRun: scrapeRunSchema,
};