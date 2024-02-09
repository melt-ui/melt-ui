import { readable, type Readable } from 'svelte/store';
import { isReadable } from '../is.js';
import { withGet, type WithGet } from '../withGet.js';

type TODO = any;

export type ToReadableStores<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends Readable<TODO> ? WithGet<T[K]> : WithGet<Readable<T[K]>>;
};

/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export function toReadableStores<T extends Record<string, unknown>>(
	properties: T
): ToReadableStores<T> {
	const result = {} as {
		[K in keyof T]: T[K] extends Readable<TODO> ? WithGet<T[K]> : WithGet<Readable<T[K]>>;
	};

	Object.keys(properties).forEach((key) => {
		const propertyKey = key as keyof T;
		const value = properties[propertyKey];
		if (isReadable(value)) {
			result[propertyKey] = withGet(value) as TODO;
		} else {
			result[propertyKey] = withGet(readable(value)) as TODO;
		}
	});

	return result;
}
