import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { getHighlighter } from 'shiki';
import { toHtml } from 'hast-util-to-html';
import { readFileSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const prettyCodeOptions = {
	theme: JSON.parse(readFileSync(resolve(__dirname, './other/themes/ayu-dark.json'), 'utf-8')),
	keepBackground: false,
	onVisitLine(node) {
		if (node.children.length === 0) {
			node.children = { type: 'text', value: ' ' };
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className.push('line--highlighted');
	},
	onVisitHighlightedWord(node) {
		node.properties.className = ['word--highlighted'];
	},
	getHighlighter: (options) =>
		getHighlighter({
			...options,
			langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'json'],
		}),
};

/** @type {import('mdsvex').MdsvexOptions} */
export const mdsvexOptions = {
	extensions: ['.md'],
	layout: resolve(__dirname, './src/docs/components/layout/layout.svelte'),
	smartypants: {
		quotes: false,
		ellipses: false,
		backticks: false,
		dashes: 'oldschool',
	},
	remarkPlugins: [remarkGfm],
	rehypePlugins: [
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeRenderCode,
		rehypePreToComponentPre,
	],
};

function rehypeComponentPreToPre() {
	return async (tree) => {
		// Replace `Component.pre` tags with regular `pre` tags.
		// This enables us to use rehype-pretty-code with our custom `pre` component.
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'Components.pre') {
				node.tagName = 'pre';
			}
		});
	};
}

function rehypePreToComponentPre() {
	return async (tree) => {
		// Replace `pre` tags with our custom `Component.pre` tags.
		// This enables us to use rehype-pretty-code with our custom `pre` component.
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'pre') {
				node.tagName = 'Components.pre';
			}
		});
	};
}

function rehypeRenderCode() {
	return async (tree) => {
		visit(tree, (node) => {
			if (
				node?.type === 'element' &&
				(node?.tagName === 'Components.pre' || node?.tagName === 'pre')
			) {
				const [codeEl] = node.children;
				if (codeEl.tagName !== 'code') {
					return;
				}
				const toHtmlString = toHtml(codeEl, {
					allowDangerousCharacters: true,
					allowDangerousHtml: true,
				});
				codeEl.type = 'raw';
				codeEl.value = `{@html \`${toHtmlString}\`}`;
			}
		});
	};
}
