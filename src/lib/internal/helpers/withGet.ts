import {
	get,
	readable,
	writable,
	type Readable,
	type Stores,
	type StoresValues,
	type Writable,
} from 'svelte/store';
import { effect, isWritable, noop } from '.';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function subscribe(store: any, ...callbacks: any[]) {
	if (store == null) {
		for (const callback of callbacks) {
			callback(undefined);
		}
		return noop;
	}
	const unsub = store.subscribe(...callbacks);
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

withGet.derived = function <S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T
): WithGet<Readable<T>> {
	let value: T | undefined = undefined;
	const single = !Array.isArray(stores);
	/** @type {Array<import('./public.js').Readable<any>>} */
	const stores_array = (single ? [stores] : stores) as unknown[];
	if (!stores_array.every(Boolean)) {
		throw new Error('derived() expects stores as input, got a falsy value');
	}
	const auto = fn.length < 2;
	const store = readable(value as T | undefined, (set) => {
		let started = false;
		const values = [] as StoresValues<S>;
		let pending = 0;
		const sync = () => {
			if (pending) {
				return;
			}
			const result = fn(single ? values[0] : values);
			if (auto) {
				set(result);
				value = result;
			}
		};
		const unsubscribers = stores_array.map((store, i) =>
			subscribe(
				store,
				(value: unknown) => {
					values[i] = value;
					pending &= ~(1 << i);
					if (started) {
						sync();
					}
				},
				() => {
					pending |= 1 << i;
				}
			)
		);
		started = true;
		sync();
		return function stop() {
			unsubscribers.forEach((fn) => fn());
			// We need to set this to false because callbacks can still happen despite having unsubscribed:
			// Callbacks might already be placed in the queue which doesn't know it should no longer
			// invoke this derived store.
			started = false;
		};
	});

	return {
		...store,
		get: () => value as T,
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
