import { nanoid } from 'nanoid/non-secure';
import type { Expand } from '../types.js';

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}

export type IdObj<T extends readonly string[]> = Expand<{ [K in T[number]]: string }>;

export function generateIds<T extends readonly string[]>(args: T): IdObj<T> {
	return args.reduce((acc, curr) => {
		acc[curr as keyof IdObj<T>] = generateId() as IdObj<T>[keyof IdObj<T>];
		return acc;
	}, {} as IdObj<T>);
}

export function stringifiedIdObjType<T extends readonly string[]>(args: T): string {
	return `Record<${args.map((arg) => `"${arg}"`).join(' | ')}, string>`;
}
