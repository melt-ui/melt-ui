import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import { effect, isWritable } from '.';

type ReadableValue<T> = T extends Readable<infer V> ? V : never;

export type WithGet<T extends Readable<unknown>> = T & {
	get: () => ReadableValue<T>;
};

export function withGet<T extends Readable<unknown>>(store: T): WithGet<T> {
	let value = get(store);

	if (isWritable(store)) {
		const update = ((cb) => {
			store.update((v) => {
				const nv = cb(v);
				value = nv;
				return nv;
			});
		}) as (typeof store)['update'];

		const set = ((v) => {
			update(() => v);
		}) as (typeof store)['set'];

		return {
			...store,
			get: () => value as ReadableValue<T>,
			update,
			set,
		};
	} else {
		effect(store, ($value) => {
			value = $value;
		});

		return {
			...store,
			get: () => value as ReadableValue<T>,
		};
	}
}

withGet.writable = function <T>(value: T): WithGet<Writable<T>> {
	return withGet(writable(value));
}

withGet.derived = function <T>(deps: Readable<unknown>[], fn: (deps: ReadableValue<Readable<unknown>>[]) => T): WithGet<Readable<T>> {
	let value: ReadableValue<Readable<T>>;
	const store = derived(deps, (deps) => {
		const nv = fn(deps);
		value = nv;
		return nv;
	})

	return {
		...store,
		get: () => value
	}
}

export function addGetToStores<T extends Record<string, Writable<unknown>>>(stores: T) {
	return Object.keys(stores).reduce(
		(acc, key) => {
			return {
				...acc,
				[key]: withGet(stores[key]),
			};
		},
		{} as {
			[K in keyof T]: WithGet<T[K]>;
		}
	);
}
