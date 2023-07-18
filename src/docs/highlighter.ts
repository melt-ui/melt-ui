import { get } from 'svelte/store';
import { highlighterStore } from './stores';
import { getHighlighter, renderToHtml, type IThemedToken } from 'shiki-es';

async function getShikiHighlighter(fetcher?: typeof fetch) {
	if (fetcher && typeof window !== 'undefined') {
		window.fetch = fetcher;
	}

	const shikiHighlighter = await getHighlighter({
		theme: 'github-dark',
		langs: ['svelte', 'typescript', 'css', 'javascript', 'json', 'bash'],
	});
	return shikiHighlighter;
}

export async function getStoredHighlighter(fetcher?: typeof fetch) {
	const currHighlighter = get(highlighterStore);
	if (currHighlighter) {
		return currHighlighter;
	}
	const shikiHighlighter = await getShikiHighlighter(fetcher);
	highlighterStore.set(shikiHighlighter);
	return shikiHighlighter;
}

type HighlightClasses = {
	pre?: string;
	code?: string;
	line?: string;
};

type HighlightCodeArgs = {
	code: string;
	lang: string;
	classes?: HighlightClasses;
	fetcher?: typeof fetch;
};

const themedTokensCache = new Map<string, IThemedToken[][]>();

export async function highlightCode({ code, lang, classes = {}, fetcher }: HighlightCodeArgs) {
	let tokens = themedTokensCache.get(code);

	if (!tokens) {
		const highlighter = await getStoredHighlighter(fetcher);
		tokens = highlighter.codeToThemedTokens(tabsToSpaces(code), lang);
		themedTokensCache.set(code, tokens);
	}

	const html = renderToHtml(tokens, {
		elements: {
			pre({ children }) {
				return `<pre data-language="${lang}" data-theme="default" class="${
					classes.pre ? classes.pre : '!mt-2'
				}">${children}</pre>`;
			},
			code({ children }) {
				return `<code data-language="${lang}" data-theme="default" class="${
					classes.code && classes.code
				}">${children}</code>`;
			},
			line({ children }) {
				if (!children) {
					return `<span data-line class="${classes.line && classes.line}">${' '}</span>`;
				}
				return `<span data-line>${children}</span>`;
			},
			token({ style, children }) {
				return `<span style="${style}">${children}</span>`;
			},
		},
	});

	return html;
}

function tabsToSpaces(code: string) {
	return code.replace(/\t/g, '  ');
}
