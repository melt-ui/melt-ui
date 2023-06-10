import { onDestroy, tick } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import { isBrowser, uuid } from '.';

export function getElementByMeltId(id: string) {
	return document.querySelector(`[data-melt-id="${id}"]`) as HTMLElement | null;
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

export function effect<S extends Stores>(
	stores: S,
	fn: (values: StoresValues<S>) => (() => void) | void
) {
	const unsub = derivedWithUnsubscribe(stores, (stores, onUnsubscribe) => {
		return {
			stores,
			onUnsubscribe,
		};
	}).subscribe(({ stores, onUnsubscribe }) => {
		const returned = fn(stores);
		if (returned) {
			onUnsubscribe(returned);
		}
	});

	onDestroy(unsub);
	return unsub;
}

type Attach = (<T extends keyof HTMLElementEventMap>(
	type: T,
	listener: (ev: HTMLElementEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions
) => void) & {
	getElement: () => Promise<HTMLElement | null>;
};

/**
 * Creates a derived store that contains attributes for an element.
 * Exposes an `attach` function to attach events to the element.
 */
export function elementDerived<S extends Stores, T extends Record<string, unknown>>(
	stores: S,
	fn: (values: StoresValues<S>, attach: Attach) => T
) {
	let eventRemovers: (() => void)[] = [];
	const removeEvents = () => {
		eventRemovers.forEach((fn) => fn());
		eventRemovers = [];
	};

	// Id outside of scope so we can pass it as an attribute
	const id = uuid();
	const attach: Attach = (event, listener, options) => {
		if (!isBrowser) return;
		tick().then(() => {
			const element = getElementByMeltId(id);
			element?.addEventListener(event, listener, options);
		});

		eventRemovers.push(() => {
			const element = getElementByMeltId(id);
			element?.removeEventListener(event, listener, options);
		});
	};
	attach.getElement = () =>
		tick().then(() => {
			if (!isBrowser) return null;
			return getElementByMeltId(id);
		});

	return derived(stores, ($storeValues) => {
		removeEvents();
		return { ...fn($storeValues, attach), 'data-melt-id': id };
	});
}

export function element<T extends Record<string, unknown>>(fn: (attach: Attach) => T) {
	return elementDerived([], (_, attach) => fn(attach));
}

type ReturnWithObj<T extends () => void, Obj> = ReturnType<T> extends void
	? Obj
	: ReturnType<T> & Obj;

/**
 * Creates a derived store that contains a function, that can be called on multiple elements.
 * Has a `createAttach` function that can be used to attach events to the elements.
 * The `createAttach` function will create a new id on every call, so only use it once per element.
 */
export function elementMultiDerived<
	S extends Stores,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => Record<string, unknown> | void
>(stores: S, fn: (values: StoresValues<S>, createAttach: () => Attach) => T) {
	let unsubscribers: (() => void)[] = [];

	// Id outside of scope so we can pass it as an attribute
	let id = uuid();
	const createAttach = () => {
		id = uuid();
		// Make sure the id is the same on tick
		const constantId = id;
		const attach: Attach = (event, listener, options) => {
			if (!isBrowser) return;
			tick().then(() => {
				const element = getElementByMeltId(constantId);
				element?.addEventListener(event, listener, options);
			});

			unsubscribers.push(() => {
				const element = getElementByMeltId(constantId);
				element?.removeEventListener(event, listener, options);
			});
		};
		attach.getElement = () =>
			tick().then(() => {
				if (!isBrowser) return null;
				return getElementByMeltId(constantId);
			});
		return attach;
	};

	return derived(stores, ($storeValues) => {
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
		const returned = fn($storeValues, createAttach);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (...args: any[]) => {
			return { ...returned(...args), 'data-melt-id': id };
		};
	}) as Readable<(...args: Parameters<T>) => ReturnWithObj<T, { 'data-melt-id': string }>>;
}

export function elementMulti<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => Record<string, unknown> | void
>(fn: (createAttach: () => Attach) => T) {
	return elementMultiDerived([], (_, createAttach) => fn(createAttach));
}
