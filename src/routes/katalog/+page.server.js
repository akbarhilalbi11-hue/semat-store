import { getCatalogData } from '#lib/server/catalog.js';

export async function load({ url }) {
	return await getCatalogData(url.searchParams);
}