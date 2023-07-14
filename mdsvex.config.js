import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { codeImport } from 'remark-code-import';
import { toHtml } from 'hast-util-to-html';
import { escapeSvelte } from '@huntabyte/mdsvex';
import rehypeRewrite from 'rehype-rewrite';
import { processMeltAttributes } from './src/docs/pp.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const prettyCodeOptions = {
	theme: 'github-dark',
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

const removePPFromText = (node) => {
	if (node?.children?.length) {
		for (const child of node.children) {
			if (child.type === 'text') {
				child.value = processMeltAttributes(child.value);
			}
			if (child.children?.length) {
				removePPFromText(child);
			}
		}
	}
};

const rehypeRewriteOptions = {
	rewrite: (node, index, parent) => {
		if (
			node?.type === 'element' &&
			node?.tagName === 'Components.pre' &&
			!node.properties['data-non-pp']
		) {
			const clonedNode = JSON.parse(JSON.stringify(node));
			const nonPPNode = {
				...clonedNode,
				properties: { ...clonedNode.properties, 'data-non-pp': true },
			};

			removePPFromText(nonPPNode);

			parent.children = [
				...parent.children.slice(0, index),
				node,
				nonPPNode,
				...parent.children.slice(index + 1),
			];
		}
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
		dashes: false,
	},
	remarkPlugins: [remarkGfm, codeImport],
	rehypePlugins: [
		[rehypeRewrite, rehypeRewriteOptions],
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
		let counter = 0;
		visit(tree, (node) => {
			if (
				node?.type === 'element' &&
				(node?.tagName === 'Components.pre' || node?.tagName === 'pre')
			) {
				counter++;

				const isNonPP = counter % 2 === 0;
				if (isNonPP) {
					node.properties = {
						...node.properties,
						'data-non-pp': '',
					};
				}

				/** @type HTMLElement */
				const codeEl = node.children[0];
				if (codeEl.tagName !== 'code') {
					return;
				}

				const meltString = toHtml(codeEl, {
					allowDangerousCharacters: true,
					allowDangerousHtml: true,
				});

				codeEl.type = 'raw';
				codeEl.value = `{@html \`${escapeSvelte(meltString)}\`}`;
			}
		});
	};
}
