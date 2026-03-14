import { FastifyInstance } from 'fastify';
import { getModels } from '../modules/models';
import { getModelBySlug } from '../modules/models';
import { getCategories } from '../modules/categories';
import { triggerScrape, getScrapeStatus } from '../modules/scraper';

export function buildRoutes(app: FastifyInstance) {
  // Model routes
  app.get('/api/models', getModels);
  app.get('/api/models/:slug', getModelBySlug);

  // Category routes
  app.get('/api/categories', getCategories);

  // Scrape routes
  app.get('/api/scrape/status', getScrapeStatus);
  app.post('/api/scrape/trigger', triggerScrape);

  // Health check
  app.get('/health', async () => {
    return { status: 'OK' };
  });
}