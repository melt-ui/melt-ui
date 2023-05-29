import { tick } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import { getElementById, isBrowser } from '../helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
/** One or more values from `Readable` stores. */
type StoresValues<T> = T extends Readable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
	  };

export function derivedWithUnsubscribe<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>, onUnsubscribe: (cb: () => void) => void) => T
) {
	let unsubscribers: (() => void)[] = [];
	const onUnsubscribe = (cb: () => void) => {
		unsubscribers.push(cb);
	};

	const derivedStore = derived(stores, ($storeValues) => {
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
		return fn($storeValues, onUnsubscribe);
	});

	return derivedStore;
}

type Attach = <T extends keyof HTMLElementEventMap>(
	radixId: string,
	type: T,
	listener: (ev: HTMLElementEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions
) => void;

export function elementDerived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>, attach: Attach) => T
) {
	let unsubscribers: (() => void)[] = [];
	const attach: Attach = (id, event, listener, options) => {
		if (isBrowser) {
			tick().then(() => {
				const element = getElementById(id);
				element?.addEventListener(event, listener, options);
			});

			unsubscribers.push(() => {
				const element = getElementById(id);
				element?.removeEventListener(event, listener, options);
			});
		}
	};

	const derivedStore = derived(stores, ($storeValues) => {
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
		return fn($storeValues, attach);
	});

	return {
		subscribe: (...args: Parameters<typeof derivedStore.subscribe>) => {
			const unsub = derivedStore.subscribe(...args);
			return () => {
				unsub();
				unsubscribers.forEach((fn) => fn());
				unsubscribers = [];
			};
		},
	};
}
