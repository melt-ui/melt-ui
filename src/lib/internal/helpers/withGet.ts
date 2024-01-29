import { get, writable, type Readable, type StoresValues, type Writable } from 'svelte/store';

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
	return {
		...store,
		get: () => get(store) as ReadableValue<T>,
	};
}

withGet.writable = function <T>(initial: T): WithGet<Writable<T>> {
	const internal = writable(initial);
	let value = initial;

	return {
		subscribe: internal.subscribe,
		set(newValue) {
			internal.set(newValue);
			value = newValue;
		},
		update(updater) {
			const newValue = updater(value);
			internal.set(newValue);
			value = newValue;
		},
		get() {
			return value;
		},
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
