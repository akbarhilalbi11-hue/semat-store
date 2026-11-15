import { eq, and, desc } from 'drizzle-orm';
import { db } from './db/index.js';
import { wishlists } from './db/schema.js';
import { getAllHydratedProducts } from './catalog.js';

/**
 * Mengambil daftar ID produk yang ada di wishlist pengguna
 * @param {number | undefined} userId
 */
export async function getUserWishlistIds(userId) {
	if (!userId) return [];
	const rows = await db
		.select({ productId: wishlists.productId })
		.from(wishlists)
		.where(eq(wishlists.userId, userId))
		.orderBy(desc(wishlists.createdAt));
	return rows.map((r) => r.productId);
}

/**
 * Menambah atau menghapus produk dari wishlist pengguna
 * @param {number} userId
 * @param {number} productId
 */
export async function toggleUserWishlist(userId, productId) {
	const existing = await db
		.select()
		.from(wishlists)
		.where(and(eq(wishlists.userId, userId), eq(wishlists.productId, Number(productId))))
		.limit(1);

	if (existing.length > 0) {
		await db.delete(wishlists).where(eq(wishlists.id, existing[0].id));
		return { saved: false, message: 'Produk dihapus dari wishlist.' };
	}

	await db.insert(wishlists).values({
		userId,
		productId: Number(productId)
	});
	return { saved: true, message: 'Produk disimpan ke wishlist Anda.' };
}

/**
 * Mengambil produk lengkap yang tersimpan di wishlist pengguna
 * @param {number} userId
 */
export async function getUserWishlistProducts(userId) {
	const ids = await getUserWishlistIds(userId);
	if (ids.length === 0) return [];

	const allProducts = await getAllHydratedProducts();
	const idSet = new Set(ids);
	return allProducts.filter((p) => idSet.has(p.id));
}