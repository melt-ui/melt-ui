import { styleToString } from '$lib/internal/helpers';
import { clsx, type ClassValue } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';
import rawGlobalCSS from '../../other/globals?raw';
import rawTailwindConfig from '../../tailwind.config.ts?raw';
import { getHighlighter, renderToHtml } from 'shiki-es';
import { highlighterStore } from '$docs/stores';
import { get } from 'svelte/store';

/**
 * Appends strings of classes. If non-truthy values are passed, they are ignored.
 * Uses tailwind-merge to merge tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Returns an array of entries sorted by key.
 */
export function sortedEntries<T>(obj: Record<string, T>): [string, T][] {
	return Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
}

export async function getShikiHighlighter() {
	const shikiHighlighter = await getHighlighter({
		theme: 'github-dark',
		langs: ['svelte', 'typescript', 'css', 'javascript', 'json', 'bash'],
	});
	return shikiHighlighter;
}

export type Tree = {
	[key: string]: Tree | string;
};

type ConstructTreeArgs<T> = {
	paths: Record<string, T>;
	basePath: string;
};

export function constructTree<T>({ paths, basePath }: ConstructTreeArgs<T>): Tree {
	const tree: Tree = {};

	for (const path in paths) {
		const cleanPath = path.replace(basePath, '').replace('/+page.svelte', '');
		const segments = cleanPath.split('/');

		let currentLevel = tree;
		for (const segment of segments.slice(0, -1)) {
			if (!(segment in currentLevel)) {
				currentLevel[segment] = {} as Tree;
			}
			currentLevel = currentLevel[segment] as Tree;
		}

		const lastSegment = segments[segments.length - 1];
		currentLevel[lastSegment] = `/${cleanPath}`;
	}

	return tree;
}

export function getFromTree(path: string, tree: Tree) {
	const segments = path.split('/');

	let currentLevel = tree;
	for (const segment of segments) {
		if (!(segment in currentLevel)) {
			return null;
		}
		currentLevel = currentLevel[segment] as Tree;
	}

	return currentLevel;
}

type IsInTreeArgs = {
	path: string;
	tree: Tree;
};

export function isInTree({ path, tree }: IsInTreeArgs) {
	const segments = path.split('/');

	let currentLevel = tree;
	for (const segment of segments) {
		if (!(segment in currentLevel)) {
			return false;
		}
		currentLevel = currentLevel[segment] as Tree;
	}

	return true;
}

const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

type FlyAndScaleOptions = {
	y: number;
	start: number;
	duration?: number;
};
export const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: options.duration ?? 150,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [options.y, 0]);
			const scale = scaleConversion(t, [0, 1], [options.start, 1]);

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};

export const formatStr = (s: string) => {
	// Capitalize and remove dashes
	return s
		.split('-')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
};

export function slugFromPath(path: string) {
	return path.replace('/src/docs/content/', '').replace('.md', '');
}

export function previewPathMatcher(path: string, builder: string) {
	const strippedPath = path.replace('/src/docs/previews/', '');
	const builderPath = strippedPath.split('/')[0];
	return builderPath === builder;
}

export const noopAction = () => {
	// do nothing
};

function tabsToSpaces(code: string) {
	return code.replace(/\t/g, '  ');
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

export async function highlightCode(code: string, lang: string) {
	const highlighter = await getStoredHighlighter();

	const tokens = highlighter.codeToThemedTokens(tabsToSpaces(code), lang);

	const html = renderToHtml(tokens, {
		elements: {
			pre({ children }) {
				return `<pre data-language="${lang}" data-theme="default">${children}</pre>`;
			},
			code({ children }) {
				return `<code data-language="${lang}" data-theme="default">${children}</code>`;
			},
			line({ children }) {
				if (!children) {
					return `<span data-line>${' '}</span>`;
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

interface ReturnedObj {
	[key: string]: {
		[key: string]: {
			[key: string]: string;
		};
	};
}

export async function createPreviewsObject(
	component: string,
	objArr: { path: string; content: string }[]
): Promise<ReturnedObj> {
	const returnedObj: ReturnedObj = {};

	// Iterate through the objects in the array
	for (const obj of objArr) {
		// Extract the parts from the path
		const regex = new RegExp(`${component}/(.+?)/(.+?)\\.svelte$`);
		const match = regex.exec(obj.path);

		if (match) {
			const [, groupKey, fileKey] = match; // Destructure the matched parts
			const { content } = obj;

			// Create the structure in the returnedObj
			if (!returnedObj[groupKey]) {
				returnedObj[groupKey] = {};
			}
			if (!returnedObj[groupKey][fileKey]) {
				returnedObj[groupKey][fileKey] = {};
			}

			const highlightedCode = await highlightCode(content, 'svelte');
			returnedObj[groupKey][fileKey]['index.svelte'] = highlightedCode ?? content;
		}
	}

	// Manually add values for 'tailwind.config.ts' and 'globals.css'
	for (const groupKey in returnedObj) {
		if (Object.prototype.hasOwnProperty.call(returnedObj, groupKey)) {
			const fileKeys = Object.keys(returnedObj[groupKey]);
			for (const fileKey of fileKeys) {
				if (!Object.prototype.hasOwnProperty.call(returnedObj[groupKey], fileKey)) {
					returnedObj[groupKey][fileKey] = {};
				}

				if (fileKey === 'tailwind') {
					const highlightedCode = await highlightCode(rawTailwindConfig, 'typescript');
					returnedObj[groupKey][fileKey]['tailwind.config.ts'] =
						highlightedCode ?? rawTailwindConfig;
				} else if (fileKey === 'css') {
					const highlightedCode = await highlightCode(rawGlobalCSS, 'css');
					returnedObj[groupKey][fileKey]['globals.css'] = highlightedCode ?? rawGlobalCSS;
				}
			}
		}
	}

	return returnedObj;
}
