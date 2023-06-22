import { getConvertedClasses } from './helpers';
import prettier from 'prettier';

function formatTailwindClasses(text: string) {
	const regex = /(?<=@apply\s)(.*?)(?=;)/g;
	const matches = text.match(regex);

	if (matches) {
		const formattedOutput = matches.join(' ');
		const convertedClasses = getConvertedClasses(formattedOutput).trim();

		const selector = text.split('{')[0].trim();

		const output = `${selector} {\n${convertedClasses}\n}`;

		return output.replace(/\n{3,}/g, '\n\n');
	}
}

function removeTabsAndNewlines(string: string): string {
	// remove tabs and new lines from string
	return string.replace(/[\t\n]/g, '');
}

/**
 * Extract the tailwind styles from a string of CSS
 * @param cssString String of CSS
 */
export async function extractTailwindStyles(template: string) {
	const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gm;
	const styleMatches = template.match(styleRegex);
	if (!styleMatches || styleMatches.length === 0) {
		return '';
	}
	const styleBlock = styleMatches[0];
	const allStylesString = removeTabsAndNewlines(
		styleBlock.replace(/<style\b[^>]*>|<\/style>/gm, '')
	);

	const styleSelectorBlocks = allStylesString.split('}').filter((block) => block !== '');
	const styleSelectorCompleteBlocks = styleSelectorBlocks.map((block) => {
		return block + '}';
	});

	const cssBlocks: string[] = [];

	styleSelectorCompleteBlocks.forEach((block) => {
		const formattedClass = formatTailwindClasses(block);
		if (formattedClass) {
			cssBlocks.push(formattedClass);
		}
	});

	const prettierConfig = await prettier.resolveConfig('./.prettierc');
	if (prettierConfig) {
		prettierConfig['parser'] = 'svelte';
	} else {
		return '';
	}
	// console.log(prettierConfigFile);

	// const formattedCssBlocks = await prettier.format(cssBlocks.join('\n\n'), prettierConfig);

	const regex = /<style(?:\s+lang="postcss")?>[\s\S]*?<\/style>/gi;
	const finalTemplate = template.replace(
		regex,
		`<style lang="postcss">${cssBlocks.join('\n\n')}</style>`
	);
	return await prettier.format(finalTemplate, prettierConfig ?? undefined);

	// return finalTemplate;
}
