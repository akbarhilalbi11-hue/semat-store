import { getHydratedCart } from '#lib/server/cart.js';
import { getUserWishlistIds } from '#lib/server/wishlist.js';

export async function load({ locals, cookies }) {
	const [cart, wishlistIds] = await Promise.all([
		getHydratedCart({ user: locals.user, cookies }),
		getUserWishlistIds(locals.user?.id)
	]);

	return {
		user: locals.user,
		cart,
		wishlistIds
	};
}