import { getUserWishlistProducts } from '#lib/server/wishlist.js';

export async function load({ locals }) {
	if (!locals.user) {
		return { requiresLogin: true, items: [] };
	}

	const items = await getUserWishlistProducts(locals.user.id);
	return { requiresLogin: false, items };
}