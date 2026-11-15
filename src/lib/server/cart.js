import crypto from 'node:crypto';
import { eq, and, asc } from 'drizzle-orm';
import { db } from './db/index.js';
import { carts, cartItems, products, productVariants, productImages } from './db/schema.js';

export const GUEST_CART_COOKIE = 'semat_guest_cart';
const GUEST_CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

/**
 * Mengambil atau membuat record keranjang untuk user login maupun tamu
 * @param {{ user?: any, cookies: import('@sveltejs/kit').Cookies, createIfMissing?: boolean }} ctx
 */
export async function resolveCart({ user, cookies, createIfMissing = false }) {
	if (user) {
		const existing = await db.select().from(carts).where(eq(carts.userId, user.id)).limit(1);
		if (existing.length > 0) return existing[0];
		if (!createIfMissing) return null;

		const [created] = await db.insert(carts).values({ userId: user.id }).returning();
		return created;
	}

	let guestToken = cookies.get(GUEST_CART_COOKIE);
	if (guestToken) {
		const existing = await db
			.select()
			.from(carts)
			.where(eq(carts.guestToken, guestToken))
			.limit(1);
		if (existing.length > 0) return existing[0];
	}

	if (!createIfMissing) return null;

	guestToken = crypto.randomUUID();
	cookies.set(GUEST_CART_COOKIE, guestToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: GUEST_CART_MAX_AGE
	});

	const [created] = await db.insert(carts).values({ guestToken }).returning();
	return created;
}

/**
 * Mengambil seluruh isi keranjang terhidrasi (produk, varian, harga, gambar, subtotal)
 * @param {{ user?: any, cookies: import('@sveltejs/kit').Cookies }} ctx
 */
export async function getHydratedCart({ user, cookies }) {
	const cart = await resolveCart({ user, cookies, createIfMissing: false });
	if (!cart) {
		return { id: null, items: [], totalQuantity: 0, subtotal: 0 };
	}

	const rows = await db
		.select({
			item: cartItems,
			product: products,
			variant: productVariants
		})
		.from(cartItems)
		.innerJoin(products, eq(cartItems.productId, products.id))
		.innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
		.where(eq(cartItems.cartId, cart.id))
		.orderBy(asc(cartItems.id));

	if (rows.length === 0) {
		return { id: cart.id, items: [], totalQuantity: 0, subtotal: 0 };
	}

	const primaryImages = await db
		.select()
		.from(productImages)
		.where(eq(productImages.isPrimary, true));
	const imgByProduct = new Map(primaryImages.map((img) => [img.productId, img.url]));

	let totalQuantity = 0;
	let subtotal = 0;

	const items = rows.map(({ item, product, variant }) => {
		const unitPrice = product.basePrice + (variant.priceDelta || 0);
		const lineTotal = unitPrice * item.quantity;
		totalQuantity += item.quantity;
		subtotal += lineTotal;

		return {
			id: item.id,
			productId: product.id,
			productName: product.name,
			productSlug: product.slug,
			variantId: variant.id,
			variantName: variant.colorName,
			colorHex: variant.colorHex,
			sku: variant.sku,
			stock: variant.stock,
			unitPrice,
			quantity: item.quantity,
			lineTotal,
			imageUrl: variant.imageUrl || imgByProduct.get(product.id) || '/products/placeholder.svg'
		};
	});

	return {
		id: cart.id,
		items,
		totalQuantity,
		subtotal
	};
}

/**
 * Menambahkan item varian ke keranjang dengan pengecekan batas stok
 * @param {{ user?: any, cookies: import('@sveltejs/kit').Cookies, variantId: number, quantity?: number }} params
 */
export async function addItemToCart({ user, cookies, variantId, quantity = 1 }) {
	const qtyToAdd = Math.max(1, Math.min(99, Number(quantity) || 1));

	const variantRows = await db
		.select({
			variant: productVariants,
			product: products
		})
		.from(productVariants)
		.innerJoin(products, eq(productVariants.productId, products.id))
		.where(and(eq(productVariants.id, Number(variantId)), eq(products.isActive, true)))
		.limit(1);

	if (variantRows.length === 0) {
		return { ok: false, message: 'Varian produk tidak ditemukan atau sudah tidak aktif.' };
	}

	const { variant, product } = variantRows[0];
	if (variant.stock <= 0) {
		return { ok: false, message: 'Stok varian ini sedang habis.' };
	}

	const cart = await resolveCart({ user, cookies, createIfMissing: true });

	const existingItem = await db
		.select()
		.from(cartItems)
		.where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variant.id)))
		.limit(1);

	if (existingItem.length > 0) {
		const nextQty = Math.min(variant.stock, existingItem[0].quantity + qtyToAdd);
		await db
			.update(cartItems)
			.set({ quantity: nextQty })
			.where(eq(cartItems.id, existingItem[0].id));
	} else {
		const initialQty = Math.min(variant.stock, qtyToAdd);
		await db.insert(cartItems).values({
			cartId: cart.id,
			productId: product.id,
			variantId: variant.id,
			quantity: initialQty
		});
	}

	return { ok: true, message: `${product.name} (${variant.colorName}) ditambahkan ke keranjang.` };
}

/**
 * Mengubah jumlah item di keranjang (jika qty <= 0 maka item dihapus)
 * @param {{ user?: any, cookies: import('@sveltejs/kit').Cookies, itemId: number, quantity: number }} params
 */
export async function updateCartItemQuantity({ user, cookies, itemId, quantity }) {
	const cart = await resolveCart({ user, cookies, createIfMissing: false });
	if (!cart) return { ok: false, message: 'Keranjang tidak ditemukan.' };

	const rows = await db
		.select({
			item: cartItems,
			variant: productVariants
		})
		.from(cartItems)
		.innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
		.where(and(eq(cartItems.id, Number(itemId)), eq(cartItems.cartId, cart.id)))
		.limit(1);

	if (rows.length === 0) {
		return { ok: false, message: 'Item keranjang tidak ditemukan.' };
	}

	const newQty = Number(quantity);
	if (newQty <= 0) {
		await db.delete(cartItems).where(eq(cartItems.id, rows[0].item.id));
		return { ok: true, message: 'Item dihapus dari keranjang.' };
	}

	const clampedQty = Math.min(rows[0].variant.stock, newQty);
	await db
		.update(cartItems)
		.set({ quantity: clampedQty })
		.where(eq(cartItems.id, rows[0].item.id));

	return { ok: true, message: 'Jumlah item diperbarui.' };
}

/**
 * Menggabungkan keranjang tamu (berdasarkan cookie) ke keranjang akun setelah login/daftar
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {number} userId
 */
export async function mergeGuestCartToUser(cookies, userId) {
	const guestToken = cookies.get(GUEST_CART_COOKIE);
	if (!guestToken) return;

	const guestCartRows = await db
		.select()
		.from(carts)
		.where(eq(carts.guestToken, guestToken))
		.limit(1);

	if (guestCartRows.length === 0) {
		cookies.delete(GUEST_CART_COOKIE, { path: '/' });
		return;
	}

	const guestCart = guestCartRows[0];
	const guestItems = await db
		.select({
			item: cartItems,
			variant: productVariants
		})
		.from(cartItems)
		.innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
		.where(eq(cartItems.cartId, guestCart.id));

	if (guestItems.length > 0) {
		let userCartRows = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
		let userCart = userCartRows[0];
		if (!userCart) {
			[userCart] = await db.insert(carts).values({ userId }).returning();
		}

		for (const { item, variant } of guestItems) {
			if (variant.stock <= 0) continue;

			const existingUserItem = await db
				.select()
				.from(cartItems)
				.where(and(eq(cartItems.cartId, userCart.id), eq(cartItems.variantId, item.variantId)))
				.limit(1);

			if (existingUserItem.length > 0) {
				const mergedQty = Math.min(variant.stock, existingUserItem[0].quantity + item.quantity);
				await db
					.update(cartItems)
					.set({ quantity: mergedQty })
					.where(eq(cartItems.id, existingUserItem[0].id));
			} else {
				await db.insert(cartItems).values({
					cartId: userCart.id,
					productId: item.productId,
					variantId: item.variantId,
					quantity: Math.min(variant.stock, item.quantity)
				});
			}
		}
	}

	await db.delete(carts).where(eq(carts.id, guestCart.id));
	cookies.delete(GUEST_CART_COOKIE, { path: '/' });
}