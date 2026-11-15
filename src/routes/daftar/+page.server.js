import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { users } from '#lib/server/db/schema.js';
import { hashPassword, createUserSession } from '#lib/server/auth.js';
import { mergeGuestCartToUser } from '#lib/server/cart.js';

export async function load({ locals, url }) {
	const redirectTo = url.searchParams.get('redirect') || '';
	if (locals.user) {
		throw redirect(303, redirectTo || '/akun');
	}
	return { redirectTo };
}

export const actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') || '').trim();
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const whatsapp = String(formData.get('whatsapp') || '').trim();
		const password = String(formData.get('password') || '');
		const confirmPassword = String(formData.get('confirmPassword') || '');
		const redirectTo = String(formData.get('redirectTo') || url.searchParams.get('redirect') || '');

		if (name.length < 2) {
			return fail(400, { error: 'Nama lengkap minimal 2 karakter.', name, email, whatsapp });
		}
		if (!email.includes('@')) {
			return fail(400, { error: 'Format alamat email tidak valid.', name, email, whatsapp });
		}
		if (whatsapp.replace(/\D/g, '').length < 9) {
			return fail(400, { error: 'Nomor WhatsApp minimal 9 digit angka.', name, email, whatsapp });
		}
		if (password.length < 6) {
			return fail(400, { error: 'Kata sandi minimal 6 karakter.', name, email, whatsapp });
		}
		if (password !== confirmPassword) {
			return fail(400, { error: 'Konfirmasi kata sandi tidak cocok.', name, email, whatsapp });
		}

		const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
		if (existing.length > 0) {
			return fail(409, { error: 'Alamat email ini sudah terdaftar. Silakan masuk.', name, email, whatsapp });
		}

		const passwordHash = await hashPassword(password);
		const [newUser] = await db
			.insert(users)
			.values({
				name,
				email,
				whatsapp,
				passwordHash,
				role: 'customer'
			})
			.returning();

		await createUserSession(cookies, newUser.id);
		await mergeGuestCartToUser(cookies, newUser.id);

		const safeRedirect =
			redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/akun';
		throw redirect(303, safeRedirect);
	}
};