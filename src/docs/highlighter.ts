import { getHighlighter, type BundledLanguage, type Highlighter } from 'shiki';

type ShikiOptions = NonNullable<Parameters<typeof getHighlighter>[0]>;

const shikiOptions: ShikiOptions = {
	themes: [import('shiki/themes/github-dark.mjs')],
	langs: [
		import('shiki/langs/svelte.mjs'),
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/css.mjs'),
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/json.mjs'),
		import('shiki/langs/shellscript.mjs'),
		'plaintext',
	],
};

const globalHighlighterCache = new WeakMap<ShikiOptions, Highlighter>();

export async function getStoredHighlighter() {
	const currHighlighter = globalHighlighterCache.get(shikiOptions);
	if (currHighlighter) {
		return currHighlighter;
	}
	const shikiHighlighter = await getHighlighter(shikiOptions);
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
};

const highlightedCodeCache = new Map<string, string>();

export async function highlightCode({ code, lang, classes = {} }: HighlightCodeArgs) {
	let cached = highlightedCodeCache.get(code);

	if (!cached) {
		const highlighter = await getStoredHighlighter();
		cached = highlighter.codeToHtml(tabsToSpaces(code), {
			lang,
			theme: 'github-dark',
			transformers: [
				{
					pre(node) {
						this.addClassToHast(node, classes.pre ? classes.pre : '!mt-0');
					},
					code(node) {
						if (classes.code) {
							this.addClassToHast(node, classes.code);
						}
					},
					line(node) {
						if (!node.children && classes.line) {
							this.addClassToHast(node, classes.line);
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
