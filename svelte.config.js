import { mdsvex } from '@huntabyte/mdsvex';
import { preprocessMeltUI } from '@melt-ui/pp';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import sequence from 'svelte-sequential-preprocessor';
import { mdsvexOptions } from './mdsvex.config.js';

function convertSyncAll(inputString) {
	// Split the input string by lines
	const lines = inputString.split('\n');

	// Initialize variables to store the output strings
	let output = '';
	let syncFunctions = '';

	// Iterate through each line
	for (const line of lines) {
		// Check if the line matches the expected format
		const match = line.match(/syncAll\((.*?)\s*,\s*\{(.*?)\}\s*\);/);
		if (match) {
			const statesOptions = match[1].trim();
			const properties = match[2].split(',').map((prop) => prop.trim());

			// Generate the createSync line
			output += `const sync = createSync(${statesOptions});\n`;

			// Generate the reactive statements for each property
			for (const prop of properties) {
				syncFunctions += `$: sync.${prop}(${prop}, (v) => (${prop} = v));\n`;
			}
		} else {
			// If the line doesn't match the format, add it as is
			output += `${line}\n`;
		}
	}

	// Combine the output strings
	output += syncFunctions;

	if (syncFunctions.length > 0) {
		// Check if there's a createSync import
		const hasCreateSyncImport = output.match(
			/import\s+{.*?createSync.*?}.*?from.*?@melt-ui\/svelte/
		);
		if (!hasCreateSyncImport) {
			// If there's no createSync import, add it
			output = `import { createSync } from '$lib/index.js';\n${output}`;
		}
	}

	return output;
}

/**
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
function syncAllPreprocessor() {
	return {
		script({ content }) {
			return {
				code: convertSyncAll(content),
			};
		},
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		mdsvex(mdsvexOptions),
		vitePreprocess(),
		syncAllPreprocessor(),
		preprocessMeltUI(),
	]),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapterStatic(),
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
