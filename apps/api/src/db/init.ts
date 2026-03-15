import { sqliteDb } from '.';
import { migrate } from 'drizzle-orm/sqlite3/migrator';

// Initialize database and run migrations
async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Run migrations
    await migrate(sqliteDb, { migrationsFolder: './src/db/migrations' });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  initDatabase();
}

export { initDatabase };