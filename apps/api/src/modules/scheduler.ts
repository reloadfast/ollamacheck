import cron from 'node-cron';
import { modelScraper } from './scraper';
import { sqliteDb } from '../db';
import { scrapeRunSchema } from '@ollamacheck/shared/src/schema';

// Scheduler for daily scraping
export class ScraperScheduler {
  private task: cron.ScheduledTask | null = null;
  private interval: string;

  constructor(interval: string = '0 0 * * *') { // Default to daily at midnight
    this.interval = interval;
  }

  start() {
    console.log(`Starting scraper scheduler with interval: ${this.interval}`);

    this.task = cron.schedule(this.interval, async () => {
      try {
        console.log('Running scheduled scrape job. ..');

        // Run the scraping process
        const candidates = await modelScraper.scrapeOllamaModels();

        console.log(`Scraped ${candidates.length} models successfully`);

        // Here you would typically save the results to the database
        // For now, we just log them

      } catch (error) {
        console.error('Error in scheduled scrape job:', error);
      }
    });

    console.log('Scheduler started');
  }

  stop() {
    if (this.task) {
      this.task.stop();
      console.log('Scheduler stopped');
    }
  }
}

// Export a singleton instance
export const scraperScheduler = new ScraperScheduler(process.env.SCRAPE_INTERVAL || '0 0 * * *');