import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
import { preprocessMeltUI } from '@melt-ui/pp';
import { mdsvex } from '@huntabyte/mdsvex';
import { mdsvexOptions } from './mdsvex.config.js';
import sequence from 'svelte-sequential-preprocessor';

const IS_PREDEPLOY = process.env.PREDEPLOY === '1';
const IS_VERCEL = process.env.VERCEL === '1';

const adapter = IS_PREDEPLOY || !IS_VERCEL ? adapterStatic() : adapterVercel({ runtime: 'edge' });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([mdsvex(mdsvexOptions), sveltePreprocess(), preprocessMeltUI()]),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter,
		prerender: {
			handleMissingId: 'ignore',
		},
		alias: {
			$routes: 'src/routes',
			'$routes/*': 'src/routes/*',
			'$test-helpers': 'src/test-helpers',
			$constants: 'src/constants',
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
