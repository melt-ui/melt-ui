import { isBrowser, styleToString } from '$lib/internal/helpers';
import { clsx, type ClassValue } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';
import rawTailwindConfig from '../../other/tailwindconfig.html?raw';
import rawGlobalCSS from '../../other/globalcss.html?raw';
import { highlightCode } from '$docs/highlighter';
import type { DocResolver, PreviewFile, PreviewResolver } from './types';
import { error } from '@sveltejs/kit';
import { isBuilderName, data, type Builder } from './data/builders';
import type { SvelteComponent } from 'svelte';
import { get, writable } from 'svelte/store';
import { processMeltAttributes } from './pp';

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

interface PreviewObj {
	[key: string]: {
		[key: string]: {
			'index.svelte'?: {
				pp: string;
				base: string;
			};
			'globals.css'?: string;
			'tailwind.config.ts'?: string;
		};
	};
}

async function createPreviewsObject(
	component: string,
	objArr: { path: string; content: string }[]
): Promise<PreviewObj> {
	const returnedObj: PreviewObj = {};

	// Create an array of promises, iterating through the objects in the array
	const promises = objArr.map(async (obj) => {
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

			const [highlightedCode, processedCode] = await Promise.all([
				highlightCode(content, 'svelte'),
				highlightCode(processMeltAttributes(content), 'svelte'),
			]);

			returnedObj[groupKey][fileKey]['index.svelte'] = {
				pp: highlightedCode ?? content,
				base: processedCode ?? content,
			};
		}
	});

	// Wait for all the promises to resolve
	await Promise.all(promises);

	// Manually add values for 'tailwind.config.ts' and 'globals.css'
	for (const groupKey in returnedObj) {
		if (Object.prototype.hasOwnProperty.call(returnedObj, groupKey)) {
			const fileKeys = Object.keys(returnedObj[groupKey]);
			for (const fileKey of fileKeys) {
				if (!Object.prototype.hasOwnProperty.call(returnedObj[groupKey], fileKey)) {
					returnedObj[groupKey][fileKey] = {};
				}

				if (fileKey === 'tailwind') {
					returnedObj[groupKey][fileKey]['tailwind.config.ts'] = rawTailwindConfig;
				} else if (fileKey === 'css') {
					returnedObj[groupKey][fileKey]['globals.css'] = rawGlobalCSS;
				}
			}
		}
	}

	return returnedObj;
}

export function isMainPreviewComponent(builder: string, path: string): boolean {
	const regexPattern = `${builder}/main/tailwind\\.svelte$`;
	const regex = new RegExp(regexPattern);
	return regex.test(path);
}

export async function getDocData(slug: string) {
	const modules = import.meta.glob('/src/docs/content/builders/**/*.md');

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		const strippedPath = slugFromPath(path).split('/')[1];
		if (strippedPath === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		throw error(404);
	}
	return doc;
}

export async function getAllPreviewSnippets(slug: string) {
	const previewsCode = import.meta.glob(`/src/docs/previews/**/*.svelte`, {
		as: 'raw',
		eager: true,
	});

	const previewCodeMatches: { path: string; content: string }[] = [];
	for (const [path, resolver] of Object.entries(previewsCode)) {
		const isMatch = previewPathMatcher(path, slug);
		if (isMatch) {
			const prev = { path, content: resolver };
			previewCodeMatches.push(prev);
		}
	}
	const previews = await createPreviewsObject(slug, previewCodeMatches);

	return previews;
}

const getPreviewName = (path: string, slug: string) => {
	return path.replaceAll(`/src/docs/previews/${slug}/`, '').split('/')[0];
};

export async function getAllPreviewComponents(slug: string) {
	const previewComponents = import.meta.glob('/src/docs/previews/**/tailwind.svelte');

	const previewCodeMatches: { [key: string]: SvelteComponent } = {};

	const promises = Object.entries(previewComponents).map(async ([path, resolver]) => {
		const isMatch = previewPathMatcher(path, slug);
		if (!isMatch) return;
		const previewName = getPreviewName(path, slug);

		const previewComp = (await resolver?.()) as PreviewFile;
		if (!previewComp) return;
		previewCodeMatches[previewName] = previewComp.default;
	});
	await Promise.all(promises);

	return previewCodeMatches;
}

export async function getPreviewComponent(name: string) {
	const previewComponents = import.meta.glob('/src/docs/previews/**/*.svelte');
	let mainPreviewObj: { path?: string; resolver?: PreviewResolver } = {};
	for (const [path, resolver] of Object.entries(previewComponents)) {
		if (isMainPreviewComponent(name, path)) {
			mainPreviewObj = { path, resolver: resolver as unknown as PreviewResolver };
			break;
		}
	}

	const mainPreview = await mainPreviewObj.resolver?.();
	if (!mainPreview) {
		throw error(500);
	}

	return mainPreview.default;
}

export async function getMainPreviewComponent(slug: string) {
	if (!isBuilderName(slug)) {
		throw error(500);
	}

	const previewComponents = import.meta.glob('/src/docs/previews/**/*.svelte');
	let mainPreviewObj: { path?: string; resolver?: PreviewResolver } = {};
	for (const [path, resolver] of Object.entries(previewComponents)) {
		if (isMainPreviewComponent(slug, path)) {
			mainPreviewObj = { path, resolver: resolver as unknown as PreviewResolver };
			break;
		}
	}

	const mainPreview = await mainPreviewObj.resolver?.();
	if (!mainPreview) {
		throw error(500);
	}

	return mainPreview.default;
}

export function transformAPIString(text: string | string[], defaultCodeColor = false) {
	if (Array.isArray(text)) {
		text = text.join(' | ');
	}
	text = text.replaceAll('"', "'");
	const regex = /`(.+?)`/g;
	return text.replace(regex, `<code class="${defaultCodeColor ? '' : 'neutral'}">$1</code>`);
}

export async function getDoc(slug: string) {
	const modules = import.meta.glob('/src/docs/content/**/*.md');

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		throw error(404);
	}
	return doc;
}

export function createHeadingId(text: string) {
	return text
		.replaceAll(/[^a-zA-Z0-9 ]/g, '')
		.replaceAll(' ', '-')
		.toLowerCase();
}

export function createCopyCodeButton() {
	const codeString = writable('');
	const copied = writable(false);
	let copyTimeout = 0;

	function copyCode() {
		if (!isBrowser) return;
		navigator.clipboard.writeText(get(codeString));
		copied.set(true);
		clearTimeout(copyTimeout);
		copyTimeout = window.setTimeout(() => {
			copied.set(false);
		}, 2500);
	}

	function setCodeString(node: HTMLElement) {
		codeString.set(node.innerText.trim() ?? '');
	}

	return {
		copied: copied,
		copyCode: copyCode,
		setCodeString: setCodeString,
	};
}

export async function getBuilderData(slug: Builder) {
	const builderData = data[slug];
	const schemas = builderData['schemas'];
	if (!schemas) return builderData;

	const promises = schemas.map(async (key) => {
		if (Object.prototype.hasOwnProperty.call(key, 'props')) {
			const props = key['props'];
			if (!props) return;
			for (const prop of props) {
				if (!prop['longType']) continue;
				const longType = prop['longType'];
				const highlightedCode = await highlightCode(longType.rawCode, 'typescript', {
					pre: '!mt-0 !mb-0',
				});
				prop['longType']['highlightedCode'] = highlightedCode;
			}
		}
	});
	await Promise.all(promises);

	builderData.schemas = schemas;
	return builderData;
}
