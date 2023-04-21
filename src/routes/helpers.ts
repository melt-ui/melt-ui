import { type ClassValue, clsx } from 'clsx';
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

export function cleanupCodeExample(code: string): string {
	// Change '$lib' imports to 'radix-svelte'
	code = code.replace(/\$lib/g, 'radix-svelte');

	return code;
}
