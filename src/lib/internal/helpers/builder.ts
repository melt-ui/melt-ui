import { tick } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import { isBrowser, uuid } from '.';

export function getElementByRadixId(id: string) {
	return document.querySelector(`[data-radix-id="${id}"]`) as HTMLElement | null;
}

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
	type: T,
	listener: (ev: HTMLElementEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions
) => void;

export function element<T>(fn: (createAttach: () => Attach) => T) {
	// Id outside of scope so we can pass it as an attribute
	let id = uuid();
	const createAttach = (): Attach => {
		id = uuid();
		// Make sure the id is the same on tick
		const constantId = id;
		return (event, listener, options) => {
			if (!isBrowser) return;
			tick().then(() => {
				const element = getElementByRadixId(constantId);
				element?.addEventListener(event, listener, options);
			});
		};
	};
	return () => {
		const returned = fn(createAttach);
		if (typeof returned === 'function') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (...args: any[]) => {
				return { ...returned(...args), 'data-radix-id': id };
			};
		}
		return { ...fn(createAttach), 'data-radix-id': id };
	};
}

export function elementDerived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>, createAttach: () => Attach) => T
) {
	let unsubscribers: (() => void)[] = [];

	// Id outside of scope so we can pass it as an attribute
	let id = uuid();
	const createAttach = (): Attach => {
		id = uuid();
		// Make sure the id is the same on tick
		const constantId = id;
		return (event, listener, options) => {
			if (!isBrowser) return;
			tick().then(() => {
				const element = getElementByRadixId(constantId);
				element?.addEventListener(event, listener, options);
			});

			unsubscribers.push(() => {
				const element = getElementByRadixId(constantId);
				element?.removeEventListener(event, listener, options);
			});
		};
	};

	const derivedStore = derived(stores, ($storeValues) => {
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
		const returned = fn($storeValues, createAttach);
		if (typeof returned === 'function') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (...args: any[]) => {
				return { ...returned(...args), 'data-radix-id': id };
			};
		}
		return { ...fn($storeValues, createAttach), 'data-radix-id': id };
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
