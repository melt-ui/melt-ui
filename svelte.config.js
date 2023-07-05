import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from '@huntabyte/mdsvex';
import { mdsvexOptions } from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$routes: 'src/routes',
			'$routes/*': 'src/routes/*',
			'$test-helpers': 'src/test-helpers',
			$constants: 'src/constants',
			'@melt-ui/svelte': 'src/lib',
			$docs: 'src/docs',
			'$docs/*': 'src/docs/*',
			$components: 'src/docs/components',
			'$components/*': 'src/docs/components/*',
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
