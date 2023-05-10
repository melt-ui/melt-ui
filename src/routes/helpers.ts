import type { PreviewSchema } from '$lib/internal/helpers';
import { clsx, type ClassValue } from 'clsx';
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

function camelCase(...str: string[]) {
	return (
		str[0].toLowerCase() +
		str
			.slice(1)
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join('')
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanupCodeExample(code: string, { meta }: PreviewSchema<any>): string {
	// Change '$lib' imports to 'radix-svelte'
	code = code.replace(/\$lib/g, 'radix-svelte');

	// Replace export let propsObj with various let declarations
	const propDeclarations = [];
	const propNameMap: Array<{ old: string; new: string }> = [];
	for (const [subCmp, { props }] of Object.entries(meta)) {
		if (!props) continue;
		for (const [prop, { default: defaultValue, type }] of Object.entries(props)) {
			const propName = camelCase(subCmp, prop);
			propNameMap.push({
				old: `propsObj.${subCmp}.${prop}`,
				new: propName,
			});

			let strType = '';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((type as any) !== 'enum') {
				strType = `: ${type}`;
			}

			// TODO: Add types
			if (defaultValue) {
				propDeclarations.push(`let ${propName}${strType} = ${JSON.stringify(defaultValue)};`);
			} else {
				propDeclarations.push(`let ${propName}${strType};`);
			}
		}
	}

	code = code.replace(/export let propsObj.*/, propDeclarations.join('\n\t'));

	propNameMap.forEach(({ old, new: newName }) => {
		code = code.replaceAll(old, newName);
	});

	return code;
}
