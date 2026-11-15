import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter()
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				// Menyembunyikan peringatan deprecasi internal dari node_modules/bootstrap
				quietDeps: true,
				silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
			}
		}
	}
});