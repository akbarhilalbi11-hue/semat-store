import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { users } from '#lib/server/db/schema.js';
import {
	verifyPassword,
	createUserSession,
	checkLoginRateLimit,
	recordFailedLogin,
	clearFailedLogin
} from '#lib/server/auth.js';
import { mergeGuestCartToUser } from '#lib/server/cart.js';

export async function load({ locals, url }) {
	const redirectTo = url.searchParams.get('redirect') || '';
	if (locals.user) {
		throw redirect(303, redirectTo || (locals.user.role === 'admin' ? '/admin' : '/akun'));
	}
	return { redirectTo };
}

export const actions = {
	default: async ({ request, cookies, getClientAddress, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const password = String(formData.get('password') || '');
		const redirectTo = String(formData.get('redirectTo') || url.searchParams.get('redirect') || '');

		if (!email || !password) {
			return fail(400, { error: 'Email dan kata sandi wajib diisi.', email });
		}

		const rateKey = `${getClientAddress()}:${email}`;
		const limit = checkLoginRateLimit(rateKey);
		if (!limit.allowed) {
			return fail(429, { error: limit.message, email });
		}

		const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
		const user = foundUsers[0];

		if (!user || !(await verifyPassword(password, user.passwordHash))) {
			recordFailedLogin(rateKey);
			return fail(401, { error: 'Email atau kata sandi tidak sesuai.', email });
		}

		clearFailedLogin(rateKey);
		await createUserSession(cookies, user.id);
		await mergeGuestCartToUser(cookies, user.id);

		// Pastikan tujuan redirect aman (hanya path internal diawali '/')
		const safeRedirect =
			redirectTo.startsWith('/') && !redirectTo.startsWith('//')
				? redirectTo
				: user.role === 'admin'
					? '/admin'
					: '/akun';

		throw redirect(303, safeRedirect);
	}
};