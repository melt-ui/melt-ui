import { nanoid } from 'nanoid/non-secure';

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}

export type IdObj<T extends string> = Expand<{ [K in T]: string }>;

export function generateIds<T extends readonly string[]>(args: T): IdObj<T[number]> {
	return args.reduce((acc, curr) => {
		acc[curr as keyof IdObj<T[number]>] = generateId() as IdObj<T[number]>[keyof IdObj<T[number]>];
		return acc;
	}, {} as IdObj<T[number]>);
}
