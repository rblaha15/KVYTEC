
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		files: {
			hooks: {
				client: 'svelte/hooks.client',
				server: 'svelte/hooks.server',
				universal: 'svelte/hooks'
			},	
			lib: 'svelte/lib',
			params: 'svelte/params',
			routes: 'svelte/routes',
			serviceWorker: 'svelte/service-worker',
			appTemplate: 'svelte/app.html',
			errorTemplate: 'svelte/error.html'
		},
		adapter: adapter({
			assets: 'dist',
			pages: 'dist'
		})
	}
};

export default config;
