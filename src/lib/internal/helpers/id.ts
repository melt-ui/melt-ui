import { nanoid } from 'nanoid/non-secure';
import type { ReadableProp } from './props.js';
import type { WithGet } from './withGet.js';
import type { Writable } from 'svelte/store';

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}

export type IdObjProp<T extends readonly string[]> = Partial<{
	[K in T[number]]: ReadableProp<string>;
}>;

export type StaticIdObj<T extends readonly string[]> = { [K in T[number]]: string };

export type IdObj<T extends readonly string[]> = { [K in T[number]]: WithGet<Writable<string>> };

export function defineIdParts<const Part extends string>(parts: Part[]) {
	return parts;
}

export function generateIds<T extends readonly string[]>(args: T): StaticIdObj<T> {
	return args.reduce((acc, curr) => {
		acc[curr as keyof StaticIdObj<T>] = generateId() as StaticIdObj<T>[keyof StaticIdObj<T>];
		return acc;
	}, {} as StaticIdObj<T>);
}

export function stringifiedIdObjType<T extends readonly string[]>(args: T): string {
	return `Record<${args.map((arg) => `"${arg}"`).join(' | ')}, string>`;
}
