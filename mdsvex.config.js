import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { codeImport } from 'remark-code-import';
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
		node.properties.className = ['line--highlighted'];
	},
	onVisitHighlightedWord(node) {
		node.properties.className = ['word--highlighted'];
	},
};

/** @type {import('mdsvex').MdsvexOptions} */
export const mdsvexOptions = {
	extensions: ['.md'],
	layout: resolve(__dirname, './src/docs/components/markdown/layout.svelte'),
	smartypants: {
		quotes: false,
		ellipses: false,
		backticks: false,
		dashes: 'oldschool',
	},
	remarkPlugins: [remarkGfm, codeImport],
	rehypePlugins: [
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
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

function rehypeHandleMetadata() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'div') {
				if (!('data-rehype-pretty-code-fragment' in node.properties)) {
					return;
				}

				const preElement = node.children.at(-1);
				if (preElement.tagName !== 'pre') {
					return;
				}

				if (node.children.at(0).tagName === 'div') {
					node.properties['data-metadata'] = '';
				}
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
