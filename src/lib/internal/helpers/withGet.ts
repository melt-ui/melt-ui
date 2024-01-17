import {
	derived,
	get,
	writable,
	type Readable,
	type Stores,
	type StoresValues,
	type Writable,
} from 'svelte/store';
import { effect, isWritable } from '.';

type ReadableValue<T> = T extends Readable<infer V> ? V : never;

export type WithGet<T extends Readable<unknown>> = T & {
	get: () => ReadableValue<T>;
};

export function withGet<T extends Readable<unknown>>(store: T): WithGet<T> {
	let value = get(store);

	if (isWritable(store)) {
		const { update: _update, set: _set } = store;

		store.update = ((cb) => {
			_update((v) => {
				const nv = cb(v);
				value = nv;
				return nv;
			});
		}) as (typeof store)['update'];

		store.set = ((v) => {
			store.update(() => v);
		}) as (typeof store)['set'];

		return {
			...store,
			get: () => value as ReadableValue<T>,
		};
	} else {
		const destroy = effect(store, ($value) => {
			value = $value;
		});

		return {
			...store,
			get: () => value as ReadableValue<T>,
			destroy,
		};
	}
}

withGet.writable = function <T>(value: T): WithGet<Writable<T>> {
	return withGet(writable(value));
};

withGet.derived = function <S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T
): WithGet<Readable<T>> {
	let value: ReadableValue<Readable<T>>;
	const store = derived(stores, (deps) => {
		const nv = fn(deps);
		value = nv;
		return nv;
	});

	value = get(store);
	return {
		...store,
		get: () => value,
	};
};

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
