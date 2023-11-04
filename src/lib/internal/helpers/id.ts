import { nanoid } from 'nanoid/non-secure';

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}

export function generateIds<Names extends string[]>(...names: Names) {
	return names.reduce((acc, name) => {
		return {
			...acc,
			[name]: generateId(),
		};
	}, {} as { [K in Names[number]]: string });
}
