import { drizzle } from 'drizzle-orm/sqlite3';
import { Database } from 'sqlite3';
import * as schema from '@ollamacheck/shared/src/schema';

// Create database connection
const db = new Database('./data/db.sqlite');
export const sqliteDb = drizzle(db, { schema });

// Export the schema for use in other modules
export { schema };