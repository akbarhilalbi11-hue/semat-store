import { json } from '@sveltejs/kit';
import { searchProductsQuick } from '#lib/server/catalog.js';

export async function GET({ url }) {
	const q = url.searchParams.get('q') || '';
	const results = await searchProductsQuick(q);
	return json({ results });
}