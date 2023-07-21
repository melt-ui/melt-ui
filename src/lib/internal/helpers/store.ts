import { writable, type Writable } from 'svelte/store';

/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export function toWritableStores<T extends Record<string, unknown>>(
	properties: T
): { [K in keyof T]: Writable<T[K]> } {
	const result = {} as { [K in keyof T]: Writable<T[K]> };

	Object.keys(properties).forEach((key) => {
		const propertyKey = key as keyof T;
		const value = properties[propertyKey];
		result[propertyKey] = writable(value);
	});

	return result;
}
