import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Helpers
function toPascalCase(...str) {
	return str.map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function toLines(...str) {
	return str.join('\n');
}

// Main
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let componentName;
let isInternal;
let subcomponentNames;

// Step 1: Ask the user for a component name
rl.question('Please enter a component name: ', (inputComponentName) => {
	componentName = capitalizeFirstLetter(inputComponentName);

	// Step 2: Ask the user if it should be an internal component
	rl.question('Should it be an internal component? (y/N): ', (internalInput) => {
		isInternal = internalInput.toLowerCase() === 'y';

		// Step 3: Ask the user for the subcomponent names
		rl.question('Please enter subcomponent names separated by commas: ', (subcomponentsInput) => {
			subcomponentNames = subcomponentsInput.split(',').map((subcomponent) => subcomponent.trim());

			console.log(`\nComponent Name: ${componentName}`);
			console.log(`Is internal: ${isInternal ? 'Yes' : 'No'}`);
			console.log('Subcomponent Names: ');
			for (let subcomponent of subcomponentNames) {
				console.log(`- ${subcomponent}`);
			}

			rl.close();

			// Get directory of curr file in esm
			const __dirname = path.dirname(fileURLToPath(import.meta.url));
			const comp_dir = isInternal
				? path.join(__dirname, '..', 'src', 'lib', 'internal', 'components', componentName)
				: path.join(__dirname, '..', 'src', 'lib', 'components', componentName);

			// Create the component directory
			fs.mkdirSync(comp_dir);

			// Create subcomponent files
			subcomponentNames.forEach((name) => {
				const file = path.join(comp_dir, `${name}.svelte`);
				const pascalCaseName = toPascalCase(componentName, name);

				fs.writeFileSync(
					file,
					toLines(
						`<script lang="ts" context="module">`,
						`\timport { useActions } from '$lib/internal/helpers';`,
						`\timport type { BaseProps } from '$lib/internal/types';`,
						`\texport type ${pascalCaseName}Props = BaseProps<'div'>;`,
						`</script>`,
						``,
						`<script lang="ts">`,
						`\ttype $$Props = ${pascalCaseName}Props;`,
						`</script>`,
						``,
						`<div {...$$restProps} use:useActions={$$restProps.use}>`,
						`\t<slot />`,
						`</div>`
					)
				);
			});

			// Create index file referencing all subcomponents
			const indexFile = path.join(comp_dir, 'index.ts');
			const subcomponentExports = subcomponentNames
				.map((name) => {
					return toLines(
						`import ${toPascalCase(name)} from './${name}.svelte';`,
						`export type { ${toPascalCase(componentName, name)}Props } from './${name}.svelte';`
					);
				})
				.join('\n');

			const mainExport = toLines(
				`export const ${toPascalCase(componentName)} = {`,
				...subcomponentNames.map((name) => `\t${toPascalCase(name)},`),
				`};`
			);

			fs.writeFileSync(indexFile, toLines(subcomponentExports, '', mainExport));

			// Create tests dir
			const testsDir = path.join(comp_dir, 'tests');
			fs.mkdirSync(testsDir);

			// Create {componentName}Test.svelte file
			const testFile = path.join(testsDir, `${componentName}Test.svelte`);
			fs.writeFileSync(
				testFile,
				toLines(
					`<script lang="ts">`,
					`\timport { ${componentName} } from '../index';`,
					`</script>`,
					``,
					`<!-- TODO: Add test component code -->`
				)
			);

			// Create {componentName}.test.ts file
			const testTsFile = path.join(testsDir, `${componentName}.test.ts`);
			fs.writeFileSync(
				testTsFile,
				toLines(
					`import { expect, test } from '@playwright/experimental-ct-svelte';`,
					`import Example from './${componentName}Test.svelte';`,
					`import { axeViolations } from '$test-helpers/axeTester.js';`,
					``,
					`test.describe('${componentName}', () => {`,
					`\ttest('No accesibility violations', async ({ mount, page }) => {`,
					`\t\tawait mount(Example);`,
					`\t\texpect(await axeViolations(page)).toEqual([]);`,
					`\t});`,
					`});`
				)
			);

			// Add component to the main index file
			const mainIndexFile = path.join(comp_dir, '..', 'index.ts');
			const mainIndexFileContent = fs.readFileSync(mainIndexFile, 'utf8');
			const newMainIndexFileContent = toLines(
				mainIndexFileContent,
				`export { ${toPascalCase(componentName)} } from './${componentName}';`
			);

			fs.writeFileSync(mainIndexFile, newMainIndexFileContent);

			// Create preview dir
			const previewDir = path.join(__dirname, '..', 'src', 'routes', '(previews)', componentName);
			fs.mkdirSync(previewDir);

			// Create example.svelte file
			const exampleFile = path.join(previewDir, 'example.svelte');
			const importDir = isInternal ? '$lib/internal/components' : '$lib';
			fs.writeFileSync(
				exampleFile,
				toLines(
					`<script lang="ts">`,
					`\timport { ${toPascalCase(componentName)} } from '${importDir}';`,
					`\timport type { ResolvedProps } from '../helpers';`,
					``,
					`\texport let propsObj: ResolvedProps<typeof ${toPascalCase(componentName)}>;`,
					`</script>`,
					``,
					`<!-- TODO: Add example code -->`
				)
			);

			// Create schema.ts file inside preview dir
			const schemaFile = path.join(previewDir, 'schema.ts');
			fs.writeFileSync(
				schemaFile,
				toLines(
					`import example from './example.svelte';`,
					`import type { PreviewSchema } from '../helpers';`,
					`import type { ${componentName} } from '${importDir}';`,
					`import code from './example.svelte?raw';`,
					``,
					`export const schema = {`,
					`\ttitle: '${componentName}',`,
					`\tdescription: 'TODO: Add description',`,
					`\texample,`,
					`\tcode,`,
					`\tmeta: {`,
					...subcomponentNames.map((name) => `\t\t${toPascalCase(name)}: {},`),
					`\t}`,
					`} satisfies PreviewSchema<typeof ${componentName}>;`
				)
			);

			// Expose schema in preview schemas file
			const previewIndexFile = path.join(previewDir, '..', 'schemas.ts');
			const previewIndexFileContent = fs.readFileSync(previewIndexFile, 'utf8');
			const currentSchemas = previewIndexFileContent.match(/schemas = \{(.|\n)*\};/g)[0];
			const newPreviewIndexFileContent = toLines(
				`import { schema as ${componentName} } from './${componentName}/schema';`,
				previewIndexFileContent.replace(
					currentSchemas,
					currentSchemas.replace('};', `\t${componentName.toLowerCase()}: ${componentName},\n};`)
				)
			);

			fs.writeFileSync(previewIndexFile, newPreviewIndexFileContent);
		});
	});
});
