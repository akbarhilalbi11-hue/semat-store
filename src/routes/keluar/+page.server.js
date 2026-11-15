import { redirect } from '@sveltejs/kit';
import { destroyUserSession } from '#lib/server/auth.js';

export async function load({ cookies }) {
	await destroyUserSession(cookies);
	throw redirect(303, '/');
}

export const actions = {
	default: async ({ cookies }) => {
		await destroyUserSession(cookies);
		throw redirect(303, '/');
	}
};