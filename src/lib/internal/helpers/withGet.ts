import { get, type Readable, type StoresValues, type Writable } from 'svelte/store';
import { effect } from '.';

type ReadableValue<T> = T extends Readable<infer V> ? V : never;

export type WithGet<T extends Readable<unknown>> = T & {
	get: () => ReadableValue<T>;
	destroy?: () => void;
};

/**
 * Transforms an existing store into a store with a `get` method.
 * Uses subscriptions to keep the value up to date, so make sure to call `destroy` when you're done with it.
 * @date 20/01/2024 - 16:38:39
 *
 * @export
 * @template {Readable<unknown>} T
 * @param {T} store
 * @returns {WithGet<T>}
 */
export function withGet<T extends Readable<unknown>>(store: T): WithGet<T> {
	let value = get(store);

	const destroy = effect(store, ($value) => {
		value = $value;
	});

	return {
		...store,
		get: () => value as ReadableValue<T>,
		destroy,
	};
}

withGet.writable = function <T>(initial: T): WithGet<Writable<T>> {
	const subscribers: ((value: T) => void)[] = [];
	let value = initial;

	const update = (fn: (value: T) => T) => {
		value = fn(value);
		for (const subscriber of subscribers) {
			subscriber(value);
		}
	};

	const set = (value: T) => update(() => value);

	const subscribe = (subscriber: (value: T) => void) => {
		subscribers.push(subscriber);
		subscriber(value);
		return () => {
			const index = subscribers.indexOf(subscriber);
			if (index !== -1) {
				subscribers.splice(index, 1);
			}
		};
	};

	return {
		set,
		update,
		subscribe,
		get: () => value,
	};
};

withGet.derived = function <
	S extends
		| WithGet<Readable<unknown>>
		| [WithGet<Readable<unknown>>, ...Array<WithGet<Readable<unknown>>>]
		| Array<WithGet<Readable<unknown>>>,
	T
>(stores: S, fn: (values: StoresValues<S>) => T): WithGet<Readable<T>> {
	const subscribers: Map<(value: T) => void, Array<() => void>> = new Map();

	const get = () => {
		const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();

		return fn(values as StoresValues<S>);
	};

	const subscribe = (subscriber: (value: T) => void) => {
		const unsubscribers: Array<() => void> = [];
		const storesArr = Array.isArray(stores) ? stores : [stores];
		storesArr.forEach((store) => {
			unsubscribers.push(
				store.subscribe(() => {
					subscriber(get());
				})
			);
		});

		subscriber(get());

		subscribers.set(subscriber, unsubscribers);

		return () => {
			const unsubscribers = subscribers.get(subscriber);
			if (unsubscribers) {
				for (const unsubscribe of unsubscribers) {
					unsubscribe();
				}
			}
			subscribers.delete(subscriber);
		};
	};

	return {
		get,
		subscribe,
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
