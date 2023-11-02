import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		// The following disabled as the logic for performing the csrf check has been implemented in
		// hooks.server.js to allow a specifiv POST route from a specified origin. This allows us to POST
		// data to the preview tool from a tool with a different origin.
		csrf: {
			checkOrigin: false
		}
	},

	preprocess: [vitePreprocess({})]
};

export default config;
