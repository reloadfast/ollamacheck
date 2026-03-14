import { sql } from 'drizzle-orm';
import { type MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create models table
  pgm.createTable('models', {
    id: { type: 'TEXT', primaryKey: true },
    slug: { type: 'TEXT', notNull: true, unique: true },
    name: { type: 'TEXT', notNull: true },
    tag: { type: 'TEXT', notNull: true },
    params_billions: { type: 'INTEGER', notNull: true },
    quantization: { type: 'TEXT', notNull: true },
    estimated_vram_gb: { type: 'INTEGER', notNull: true },
    weekly_pulls: { type: 'INTEGER', notNull: true, default: 0 },
    fit_score: { type: 'INTEGER', notNull: true, default: 0 },
    pull_command: { type: 'TEXT', notNull: true },
    last_scraped_at: { type: 'TEXT', notNull: true },
    created_at: { type: 'TEXT', notNull: true },
  });

  // Create categories table
  pgm.createTable('categories', {
    id: { type: 'TEXT', primaryKey: true },
    slug: { type: 'TEXT', notNull: true, unique: true },
    label: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT', notNull: true },
    icon: { type: 'TEXT' },
  });

  // Create model_categories join table
  pgm.createTable('model_categories', {
    model_id: { type: 'TEXT', notNull: true },
    category_id: { type: 'TEXT', notNull: true },
  });

  // Add foreign key constraints
  pgm.addConstraint('model_categories', 'fk_model_id', {
    foreignKeys: {
      columns: ['model_id'],
      references: 'models(id)',
    },
  });

  pgm.addConstraint('model_categories', 'fk_category_id', {
    foreignKeys: {
      columns: ['category_id'],
      references: 'categories(id)',
    },
  });

  // Add indexes
  pgm.createIndex('models', ['slug']);
  pgm.createIndex('models', ['name']);
  pgm.createIndex('models', ['params_billions']);
  pgm.createIndex('models', ['estimated_vram_gb']);
  pgm.createIndex('models', ['weekly_pulls']);
  pgm.createIndex('models', ['fit_score']);

  pgm.createIndex('categories', ['slug']);
  pgm.createIndex('categories', ['label']);

  pgm.createIndex('model_categories', ['model_id']);
  pgm.createIndex('model_categories', ['category_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('models');
  pgm.dropTable('categories');
  pgm.dropTable('model_categories');
}