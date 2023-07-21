import { nanoid } from 'nanoid/non-secure';

/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId(): string {
	return nanoid(10);
}
