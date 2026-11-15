import { getHomePageData } from '#lib/server/catalog.js';

export async function load() {
	return await getHomePageData();
}