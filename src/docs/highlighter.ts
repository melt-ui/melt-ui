import { get } from 'svelte/store';
import { highlighterStore } from './stores';
import { getHighlighter, renderToHtml } from 'shiki-es';

export async function getShikiHighlighter() {
	const shikiHighlighter = await getHighlighter({
		theme: 'github-dark',
		langs: ['svelte', 'typescript', 'css', 'javascript', 'json', 'bash'],
	});
	return shikiHighlighter;
}

async function getStoredHighlighter() {
	const currHighlighter = get(highlighterStore);
	if (currHighlighter) {
		return currHighlighter;
	}
	const shikiHighlighter = await getShikiHighlighter();
	highlighterStore.set(shikiHighlighter);
	return shikiHighlighter;
}

type HighlightClasses = {
	pre?: string;
	code?: string;
	line?: string;
};

export async function highlightCode(code: string, lang: string, classes: HighlightClasses = {}) {
	const highlighter = await getStoredHighlighter();

	const tokens = highlighter.codeToThemedTokens(tabsToSpaces(code), lang);

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
