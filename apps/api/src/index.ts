import fastify from 'fastify';
import { initDatabase } from './db/init';
import { buildRoutes } from './routes';
import { scraperScheduler } from './modules/scheduler';

// Create Fastify instance
const app = fastify({
  logger: true,
});

// Initialize database
initDatabase().then(() => {
  console.log('Database initialized');

  // Register plugins
  app.register(import('@fastify/helmet'));
  app.register(import('@fastify/cors'), {
    origin: process.env.API_ORIGIN || 'http://localhost:5173',
  });
  app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register routes
  buildRoutes(app);

  // Start scheduler
  scraperScheduler.start();

  // Health check route
  app.get('/health', async () => {
    return { status: 'OK' };
  });

  // Start server
  const start = async () => {
    try {
      await app.listen({
        port: parseInt(process.env.API_PORT || '3001'),
        host: process.env.API_HOST || 'localhost',
      });
      console.log(`Server listening on http://localhost:${process.env.API_PORT || 3001}`);
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };

  start();
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});