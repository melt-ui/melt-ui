import { ensureDir } from 'https://deno.land/std@0.208.0/fs/ensure_dir.ts';
import { copy } from 'https://deno.land/std@0.208.0/fs/copy.ts';
import { emptyDir } from 'https://deno.land/std@0.109.0/fs/empty_dir.ts';
import { PREVIEWS_DIR_PATH, CSS_STACK_DIR_NAME } from './constants.ts';
import { processHtml } from './processHtml.ts';
import { convertClassMappingToStyle } from './convertClassMappingToStyle.ts';
import { convertTwStyles } from './convertTwStyles.ts';

for await (const previewEntry of Deno.readDir(PREVIEWS_DIR_PATH)) {
	if (!previewEntry.isDirectory) continue;

	if (previewEntry.name !== 'avatar') continue;

	const DEMOS_DIR_PATH = `${PREVIEWS_DIR_PATH}/${previewEntry.name}`;

	for await (const demoDirEntry of Deno.readDir(DEMOS_DIR_PATH)) {
		if (!previewEntry.isDirectory) continue;

		const DEMO_STACK_DIR_PATH = `${DEMOS_DIR_PATH}/${demoDirEntry.name}`;
		const TW_STACK_DIR_PATH = `${DEMO_STACK_DIR_PATH}/tailwind`;
		const CSS_STACK_DIR_PATH = `${DEMO_STACK_DIR_PATH}/${CSS_STACK_DIR_NAME}/`;

		await emptyDir(CSS_STACK_DIR_PATH);

		// tailwind/*.svelte, ...
		for await (const twDirEntry of Deno.readDir(TW_STACK_DIR_PATH)) {
			ensureDir(CSS_STACK_DIR_PATH);

			if (twDirEntry.isDirectory) {
				await copy(`${TW_STACK_DIR_PATH}/${twDirEntry.name}`, `${CSS_STACK_DIR_PATH}`);
			} else if (twDirEntry.isFile) {
				if (twDirEntry.name.endsWith('.svelte')) {
					// ./src/docs/previews/avatar/main/tailwind/index.svelte
					const componentTextContent = await Deno.readTextFile(
						`${TW_STACK_DIR_PATH}/${twDirEntry.name}`
					);

					const { mapping, modifiedHtml } = processHtml(componentTextContent);
					const cssStyle = convertClassMappingToStyle(mapping);

					const TW_INPUT_CSSTEMP_FILE_PATH = `${CSS_STACK_DIR_PATH}/${twDirEntry.name}.input.temp.css`;
					const TW_OUTPUT_CSSTEMP_FILE_PATH = `${CSS_STACK_DIR_PATH}/${twDirEntry.name}.output.temp.css`;

					// TODO what if style tag already exists
					await Deno.writeTextFile(TW_INPUT_CSSTEMP_FILE_PATH, cssStyle);

					await convertTwStyles(TW_INPUT_CSSTEMP_FILE_PATH, TW_OUTPUT_CSSTEMP_FILE_PATH);

					const twOutputCSSTempFileContent = await Deno.readTextFile(TW_OUTPUT_CSSTEMP_FILE_PATH);
					const componentStyles = `
<style>
    ${twOutputCSSTempFileContent}
</style>
`;

					await Deno.writeTextFile(
						`${CSS_STACK_DIR_PATH}/${twDirEntry.name}`,
						modifiedHtml + componentStyles
					);

					await Deno.remove(TW_INPUT_CSSTEMP_FILE_PATH);
					await Deno.remove(TW_OUTPUT_CSSTEMP_FILE_PATH);
				} else {
					await Deno.copyFile(`${TW_STACK_DIR_PATH}/${twDirEntry.name}`, `${CSS_STACK_DIR_PATH}`);
				}
			}
		}
	}
}
