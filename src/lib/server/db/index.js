import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL belum diatur di file .env atau Environment Variables.');
}

// Deteksi otomatis apakah koneksi mengarah ke PostgreSQL lokal atau cloud (Neon)
const isLocal =
	connectionString.includes('localhost') ||
	connectionString.includes('127.0.0.1') ||
	connectionString.includes('sslmode=disable');

// Pada Neon (pooled connection), prepare: false mencegah konflik prepared statement PgBouncer
const client = postgres(connectionString, {
	ssl: isLocal ? false : 'require',
	prepare: false,
	max: isLocal ? 10 : 5
});

export const db = drizzle(client, { schema });
export { client };