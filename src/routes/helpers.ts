import { styleToString } from '$lib/internal/helpers';
import { clsx, type ClassValue } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

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
