import { json } from '@sveltejs/kit';
import { toggleUserWishlist, getUserWishlistIds } from '#lib/server/wishlist.js';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json(
			{ ok: false, requiresAuth: true, message: 'Silakan masuk terlebih dahulu untuk menyimpan wishlist.' },
			{ status: 401 }
		);
	}

	const body = await request.json();
	const result = await toggleUserWishlist(locals.user.id, Number(body.productId));
	const wishlistIds = await getUserWishlistIds(locals.user.id);

	return json({ ok: true, ...result, wishlistIds });
}