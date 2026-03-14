import { FastifyReply, FastifyRequest } from 'fastify';
import { scrapeOllamaModels } from '../modules/scraper/index';
import { sqliteDb } from '../db';

// Get scrape status
export async function getScrapeStatus(request: FastifyRequest, reply: FastifyReply) {
  try {
    // In a real implementation:
    // 1. Query database for the latest scrape run
    // 2. Return status information

    // For now, return mock data
    const status = {
      id: "1",
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      finishedAt: new Date(),
      modelsProcessed: 15,
      status: 'success',
      errorMessage: null
    };

    return { data: status };
  } catch (error) {
    console.error('Error fetching scrape status:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// Trigger manual scrape
export async function triggerScrape(request: FastifyRequest, reply: FastifyReply) {
  try {
    // In a real implementation:
    // 1. Validate that the request is from an authorized source (admin only)
    // 2. Start the scraping process in background
    // 3. Return immediate response with job ID or status

    // For now, simulate scraping and return mock results
    const candidates = await scrapeOllamaModels();

    return {
      message: 'Scrape completed successfully',
      modelsProcessed: candidates.length,
      data: candidates.slice(0, 5) // Return first 5 for demo
    };
  } catch (error) {
    console.error('Error triggering scrape:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}