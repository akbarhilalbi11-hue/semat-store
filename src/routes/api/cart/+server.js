import { json } from '@sveltejs/kit';
import {
	addItemToCart,
	updateCartItemQuantity,
	getHydratedCart
} from '#lib/server/cart.js';

export async function POST({ request, locals, cookies }) {
	try {
		const body = await request.json();
		const result = await addItemToCart({
			user: locals.user,
			cookies,
			variantId: Number(body.variantId),
			quantity: Number(body.quantity || 1)
		});

		if (!result.ok) {
			return json(result, { status: 400 });
		}

		const cart = await getHydratedCart({ user: locals.user, cookies });
		return json({ ...result, cart });
	} catch (err) {
		console.error('POST /api/cart error:', err);
		return json(
			{ ok: false, message: 'Terjadi kesalahan saat menyimpan item ke keranjang.' },
			{ status: 500 }
		);
	}
}

export async function PATCH({ request, locals, cookies }) {
	try {
		const body = await request.json();
		const result = await updateCartItemQuantity({
			user: locals.user,
			cookies,
			itemId: Number(body.itemId),
			quantity: Number(body.quantity)
		});

		if (!result.ok) {
			return json(result, { status: 400 });
		}

		const cart = await getHydratedCart({ user: locals.user, cookies });
		return json({ ...result, cart });
	} catch (err) {
		console.error('PATCH /api/cart error:', err);
		return json(
			{ ok: false, message: 'Terjadi kesalahan saat memperbarui keranjang.' },
			{ status: 500 }
		);
	}
}