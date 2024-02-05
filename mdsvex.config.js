//@ts-check
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
import { getHighlighter } from 'shikiji';

/**
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('unified').Transformer<HastRoot, HastRoot>} HastTransformer
 * @typedef {import('unified').Transformer<MdastRoot, MdastRoot>} MdastTransformer
 */

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
	theme: 'github-dark',
	keepBackground: false,
	onVisitLine(node) {
		if (node.children.length === 0) {
			console.log('empty line');
			// @ts-expect-error we're modifying the node type
			node.children = { type: 'text', value: ' ' };
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className = ['line--highlighted'];
	},
	onVisitHighlightedChars(node) {
		node.properties.className = ['chars--highlighted'];
	},
	getHighlighter: (options) => {
		return getHighlighter({
			...options,
			langs: [
				'plaintext',
				import('shikiji/langs/svelte.mjs'),
				import('shikiji/langs/typescript.mjs'),
				import('shikiji/langs/css.mjs'),
				import('shikiji/langs/javascript.mjs'),
				import('shikiji/langs/json.mjs'),
				import('shikiji/langs/shellscript.mjs'),
			],
			themes: [import('shikiji/themes/github-dark.mjs')],
		});
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

export const mdsvexOptions = {
	extensions: ['.md'],
	layout: resolve(__dirname, './src/docs/components/markdown/layout.svelte'),
	smartypants: {
		quotes: false,
		ellipses: false,
		backticks: false,
		dashes: false,
	},
	remarkPlugins: [remarkGfm, remarkEscapeSvelte, codeImport],
	rehypePlugins: [
		[rehypeRewrite, rehypeRewriteOptions],
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
		rehypeRenderCode,
		rehypePreToComponentPre,
	],
};

/**
 * @returns {HastTransformer}
 */
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

const entities = [
	[/</g, '&lt;'],
	[/>/g, '&gt;'],
	[/{/g, '&#123;'],
	[/}/g, '&#125;'],
];

/**
 * @returns {MdastTransformer}
 */
function remarkEscapeSvelte() {
	return async (tree) => {
		visit(tree, 'inlineCode', escape);

		function escape(node) {
			for (let i = 0; i < entities.length; i += 1) {
				node.value = node.value.replace(entities[i][0], entities[i][1]);
			}
		}
	};
}

/**
 * @returns {HastTransformer}
 */
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

/**
 * @returns {HastTransformer}
 */
function rehypeHandleMetadata() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'figure') {
				if (!('data-rehype-pretty-code-figure' in node.properties)) {
					return;
				}

				const preElement = node.children.at(-1);
				if (preElement && 'tagName' in preElement && preElement.tagName !== 'pre') {
					return;
				}

				const firstChild = node.children.at(0);
				if (firstChild && 'tagName' in firstChild && firstChild.tagName === 'figcaption') {
					node.properties['data-metadata'] = '';
					const lastChild = node.children.at(-1);
					if (lastChild && 'properties' in lastChild) {
						lastChild.properties['data-metadata'] = '';
					}
				}
			}
		});
	};
}

/**
 * @returns {HastTransformer}
 */
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

				const codeEl = node.children[0];
				if (codeEl.type === 'element' && codeEl.tagName !== 'code') {
					return;
				}

				if (codeEl.type === 'element') {
					const meltString = tabsToSpaces(
						toHtml(codeEl, {
							allowDangerousCharacters: true,
							allowDangerousHtml: true,
						})
					);

					//@ts-expect-error we're modifying the node type
					codeEl.type = 'raw';
					//@ts-expect-error this is now a raw node which has a value property
					codeEl.value = `{@html \`${escapeSvelte(meltString)}\`}`;
				}
			}
		});
	};
}

function tabsToSpaces(code) {
	return code.replaceAll('    ', '  ').replaceAll('\t', '  ');
}
