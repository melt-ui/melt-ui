import { highlighterStore } from './stores.js';
import { getHighlighter, type BundledLanguage, type Highlighter, addClassToHast } from 'shikiji';

type ShikiOptions = NonNullable<Parameters<typeof getHighlighter>[0]>;

const shikiOptions: ShikiOptions = {
	themes: [import('shikiji/themes/github-dark.mjs')],
	langs: [
		import('shikiji/langs/svelte.mjs'),
		import('shikiji/langs/typescript.mjs'),
		import('shikiji/langs/css.mjs'),
		import('shikiji/langs/javascript.mjs'),
		import('shikiji/langs/json.mjs'),
		import('shikiji/langs/shellscript.mjs'),
		'plaintext',
	],
};

const globalHighlighterCache = new WeakMap<ShikiOptions, Highlighter>();

async function getShikiHighlighter() {
	const shikiHighlighter = await getHighlighter(shikiOptions);
	return shikiHighlighter;
}

export async function getStoredHighlighter() {
	const currHighlighter = globalHighlighterCache.get(shikiOptions);
	if (currHighlighter) {
		return currHighlighter;
	}
	const shikiHighlighter = await getShikiHighlighter();
	globalHighlighterCache.set(shikiOptions, shikiHighlighter);
	return shikiHighlighter;
}

type HighlightClasses = {
	pre?: string;
	code?: string;
	line?: string;
};

type HighlightCodeArgs = {
	code: string;
	lang: BundledLanguage;
	classes?: HighlightClasses;
	fetcher?: typeof fetch;
};

const highlightedCodeCache = new Map<string, string>();

export async function highlightCode({ code, lang, classes = {}, fetcher }: HighlightCodeArgs) {
	let cached = highlightedCodeCache.get(code);

	if (!cached) {
		const highlighter = await getStoredHighlighter();
		cached = highlighter.codeToHtml(tabsToSpaces(code), {
			lang,
			theme: 'github-dark',
			transformers: [
				{
					pre(node) {
						addClassToHast(node, classes.pre ? classes.pre : '!mt-0');
					},
					code(node) {
						if (classes.code) {
							addClassToHast(node, classes.code);
						}
					},
					line(node) {
						if (!node.children && classes.line) {
							addClassToHast(node, classes.line);
						}
					},
				},
			],
		});
		highlightedCodeCache.set(code, cached);
	}

	return cached;
}

function tabsToSpaces(code: string) {
	return code.replace(/\t/g, '  ');
}
