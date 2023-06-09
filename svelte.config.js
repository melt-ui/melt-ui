import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true,
		}),
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$routes: 'src/routes',
			'$test-helpers': 'src/test-helpers',
			$constants: 'src/constants',
			'@melt-ui/svelte': 'src/lib',
		},
		typescript: {
			config: (config) => {
				return {
					compilerOptions: {
						...config.compilerOptions,
						baseUrl: '.',
						paths: {
							...config.compilerOptions.paths,
							'$test-helpers': ['../src/test-helpers/'],
							'$test-helpers/*': ['../src/test-helpers/*'],
						},
					},
					include: [...config.include, '**/*.test.ts'],
				};
			},
		},
	},
};

export default config;
