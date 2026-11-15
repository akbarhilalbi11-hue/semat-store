import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq, and, gt, lt } from 'drizzle-orm';
import { db } from './db/index.js';
import { users, sessions } from './db/schema.js';

export const SESSION_COOKIE_NAME = 'semat_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 hari

// Rate limiter sederhana di memori untuk mencegah brute-force login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 menit

/**
 * Memeriksa apakah IP/email sedang terkena batas percobaan login
 * @param {string} key
 */
export function checkLoginRateLimit(key) {
	const now = Date.now();
	const record = loginAttempts.get(key);
	if (!record) return { allowed: true };

	if (now - record.firstAttemptAt > WINDOW_MS) {
		loginAttempts.delete(key);
		return { allowed: true };
	}

	if (record.count >= MAX_ATTEMPTS) {
		const retryMinutes = Math.ceil((WINDOW_MS - (now - record.firstAttemptAt)) / 60000);
		return {
			allowed: false,
			message: `Terlalu banyak percobaan masuk gagal. Silakan coba lagi dalam ${retryMinutes} menit.`
		};
	}

	return { allowed: true };
}

/**
 * @param {string} key
 */
export function recordFailedLogin(key) {
	const now = Date.now();
	const record = loginAttempts.get(key);
	if (!record || now - record.firstAttemptAt > WINDOW_MS) {
		loginAttempts.set(key, { count: 1, firstAttemptAt: now });
	} else {
		record.count += 1;
	}
}

/**
 * @param {string} key
 */
export function clearFailedLogin(key) {
	loginAttempts.delete(key);
}

/**
 * @param {string} plainPassword
 */
export async function hashPassword(plainPassword) {
	return await bcrypt.hash(plainPassword, 10);
}

/**
 * @param {string} plainPassword
 * @param {string} passwordHash
 */
export async function verifyPassword(plainPassword, passwordHash) {
	return await bcrypt.compare(plainPassword, passwordHash);
}

/**
 * @param {string} rawToken
 */
function hashSessionToken(rawToken) {
	return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Membuat sesi baru di database dan menyetel cookie httpOnly
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {number} userId
 */
export async function createUserSession(cookies, userId) {
	const rawToken = crypto.randomBytes(32).toString('hex');
	const tokenHash = hashSessionToken(rawToken);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

	// Bersihkan sesi kedaluwarsa milik user secara berkala
	await db
		.delete(sessions)
		.where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));

	await db.insert(sessions).values({
		tokenHash,
		userId,
		expiresAt
	});

	cookies.set(SESSION_COOKIE_NAME, rawToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: SESSION_MAX_AGE_SECONDS
	});
}

/**
 * Membaca dan memvalidasi sesi pengguna dari cookie request
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export async function getUserFromSessionCookie(cookies) {
	const rawToken = cookies.get(SESSION_COOKIE_NAME);
	if (!rawToken) return null;

	const tokenHash = hashSessionToken(rawToken);
	const now = new Date();

	const rows = await db
		.select({
			sessionId: sessions.id,
			user: {
				id: users.id,
				name: users.name,
				email: users.email,
				whatsapp: users.whatsapp,
				role: users.role,
				createdAt: users.createdAt
			}
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
		.limit(1);

	if (rows.length === 0) {
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	return rows[0].user;
}

/**
 * Menghapus sesi dari database dan menghapus cookie saat logout
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export async function destroyUserSession(cookies) {
	const rawToken = cookies.get(SESSION_COOKIE_NAME);
	if (rawToken) {
		const tokenHash = hashSessionToken(rawToken);
		await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
	}
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}