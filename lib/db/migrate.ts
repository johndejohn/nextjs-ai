import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL.trim() === '') {
    console.warn('⚠️ POSTGRES_URL is not defined. Skipping migrations.');
    console.warn('   Migrations will run automatically on Vercel deployment.');
    process.exit(0);
  }

  // Validate POSTGRES_URL format
  try {
    new URL(process.env.POSTGRES_URL);
  } catch (error) {
    console.warn('⚠️ POSTGRES_URL is invalid. Skipping migrations.');
    console.warn('   Migrations will run automatically on Vercel deployment.');
    process.exit(0);
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  // If it's an invalid URL error, skip migrations gracefully
  if (err.code === 'ERR_INVALID_URL' || err.message?.includes('Invalid URL')) {
    console.warn('⚠️ POSTGRES_URL is invalid. Skipping migrations.');
    console.warn('   Migrations will run automatically on Vercel deployment.');
    process.exit(0);
  }
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
