import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db, client } from './index.js';

const url = process.env.DATABASE_URL || '';
if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
	console.error('DITOLAK: db:reset hanya boleh dijalankan pada database lokal (localhost).');
	process.exit(1);
}

console.log('Mereset schema public pada database lokal...');
await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
await db.execute(sql`CREATE SCHEMA public`);
await db.execute(sql`GRANT ALL ON SCHEMA public TO CURRENT_USER`);
await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);

console.log('Schema public berhasil direset. Jalankan "npm run db:migrate && npm run db:seed".');
await client.end();