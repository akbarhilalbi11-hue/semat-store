import { error, redirect } from '@sveltejs/kit';
import { getUserFromSessionCookie } from '#lib/server/auth.js';

export async function handle({ event, resolve }) {
	event.locals.user = await getUserFromSessionCookie(event.cookies);

	const pathname = event.url.pathname;

	// Jika user yang sedang login adalah admin, kunci sesi hanya di area /admin (kecuali /keluar & /api)
	if (
		event.locals.user?.role === 'admin' &&
		!pathname.startsWith('/admin') &&
		!pathname.startsWith('/keluar') &&
		!pathname.startsWith('/api')
	) {
		throw redirect(303, '/admin');
	}

	// Proteksi area Admin: wajib login dan memiliki role 'admin' (selain itu tolak 403)
	if (pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, `/masuk?redirect=${encodeURIComponent(pathname)}`);
		}
		if (event.locals.user.role !== 'admin') {
			throw error(403, 'Akses ditolak. Halaman ini khusus untuk administrator toko SEMAT.');
		}
	}

	// Proteksi area Akun Pelanggan & Checkout: wajib login
	if (pathname.startsWith('/akun') || pathname.startsWith('/checkout')) {
		if (!event.locals.user) {
			throw redirect(303, `/masuk?redirect=${encodeURIComponent(pathname)}`);
		}
	}

	return resolve(event);
}