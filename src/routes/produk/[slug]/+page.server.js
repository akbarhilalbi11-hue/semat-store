import { error } from '@sveltejs/kit';
import { getProductDetailBySlug } from '#lib/server/catalog.js';

export async function load({ params }) {
	const result = await getProductDetailBySlug(params.slug);
	if (!result) {
		throw error(404, 'Produk tidak ditemukan di katalog SEMAT.');
	}
	return result;
}