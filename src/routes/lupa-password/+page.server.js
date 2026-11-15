import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { users } from '#lib/server/db/schema.js';
import { hashPassword } from '#lib/server/auth.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const newPassword = String(formData.get('newPassword') || '');

		if (!email || newPassword.length < 6) {
			return fail(400, {
				error: 'Masukkan email terdaftar dan kata sandi baru minimal 6 karakter.',
				email
			});
		}

		const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
		if (existing.length === 0) {
			return fail(404, { error: 'Alamat email tidak ditemukan dalam sistem.', email });
		}

		const passwordHash = await hashPassword(newPassword);
		await db
			.update(users)
			.set({ passwordHash, updatedAt: new Date() })
			.where(eq(users.id, existing[0].id));

		return {
			success: true,
			message: `Simulasi pemulihan berhasil: kata sandi untuk ${email} telah diperbarui.`
		};
	}
};