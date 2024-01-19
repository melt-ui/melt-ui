import { type Writable, writable } from 'svelte/store';
import { withGet, type WithGet } from '../withGet';

export type ToWritableStores<T extends Record<string, unknown>> = {
	[K in keyof T]: WithGet<Writable<T[K]>>;
};

/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export function toWritableStores<T extends Record<string, unknown>>(
	properties: T
): ToWritableStores<T> {
	const result = {} as { [K in keyof T]: WithGet<Writable<T[K]>> };

	Object.keys(properties).forEach((key) => {
		const propertyKey = key as keyof T;
		const value = properties[propertyKey];
		result[propertyKey] = withGet(writable(value));
	});

	return result;
}
