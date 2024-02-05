import type { Readable, StoresValues } from 'svelte/store';
import { effect } from './store/effect.js';

export type WithGet<T extends Readable<unknown>> = T & {
	get: () => StoresValues<T>;
};

export function withGet<T extends Readable<unknown>>(store: T): WithGet<T> {
	let value: StoresValues<T>;

	effect(store, (v) => {
		value = v;
	});

	return {
		...store,
		get: () => value,
	};
}

export function addGetToStores<T extends Record<string, Readable<unknown>>>(stores: T) {
	return Object.keys(stores).reduce(
		(acc, key) => {
			const store = stores[key] as T[keyof T];
			acc[key as keyof T] = withGet(store);
			return acc;
		},
		{} as {
			[K in keyof T]: WithGet<T[K]>;
		}
	);
}
