import { nanoid } from 'nanoid';

let id = 0;
/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId() {
	return id++;
}
