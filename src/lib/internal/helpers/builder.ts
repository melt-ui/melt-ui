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

/**
 * A utility function that creates a derived store that automatically
 * unsubscribes from its dependencies.
 *
 * @template S - The type of the stores object
 * @template T - The type of the derived store
 * @param stores - The stores object to derive from
 * @param fn - The function to derive the store from
 * @returns A derived store that automatically unsubscribes from its dependencies
 */
export function derivedWithUnsubscribe<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>, onUnsubscribe: (cb: () => void) => void) => T
): Readable<T> {
	let unsubscribers: (() => void)[] = [];
	const onUnsubscribe = (cb: () => void) => {
		unsubscribers.push(cb);
	};

	const derivedStore = derived(stores, ($storeValues) => {
		// Call all of the unsubscribe functions from the previous run of the function
		unsubscribers.forEach((fn) => fn());
		// Clear the list of unsubscribe functions
		unsubscribers = [];

		return fn($storeValues, onUnsubscribe);
	});

	return derivedStore;
}

/**
 * A utility function that creates an effect from a set of stores and a function.
 * The effect is automatically cleaned up when the component is destroyed.
 *
 * @template S - The type of the stores object
 * @param stores - The stores object to derive from
 * @param fn - The function to run when the stores change
 * @returns A function that can be used to unsubscribe the effect
 */
export function effect<S extends Stores>(
	stores: S,
	fn: (values: StoresValues<S>) => (() => void) | void
): () => void {
	// Create a derived store that contains the stores object and an onUnsubscribe function
	const unsub = derivedWithUnsubscribe(stores, (stores, onUnsubscribe) => {
		return {
			stores,
			onUnsubscribe,
		};
	}).subscribe(({ stores, onUnsubscribe }) => {
		const returned = fn(stores);
		// If the function returns a cleanup function, call it when the effect is unsubscribed
		if (returned) {
			onUnsubscribe(returned);
		}
	});

	// Automatically unsubscribe the effect when the component is destroyed
	onDestroy(unsub);
	return unsub;
}

/**
 * A type that represents a function that can be used to attach events to an HTML element.
 * The function is also augmented with a `getElement` function that returns a promise that
 * resolves to the element.
 *
 * @template T - The type of the event to attach
 * @param type - The type of the event to attach
 * @param listener - The function to call when the event is triggered
 * @param options - An optional object that specifies options for the event listener
 */
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
 *
 * @template S - The type of the stores object
 * @template T - The type of the attributes object
 * @param stores - The stores object to derive from
 * @param fn - The function to derive the attributes from
 * @returns A derived store that contains the attributes for an element
 */
export function elementDerived<S extends Stores, T extends Record<string, unknown>>(
	stores: S,
	fn: (values: StoresValues<S>, attach: Attach) => T
) {
	// An array of functions that will be called to unsubscribe from events
	let eventRemovers: (() => void)[] = [];

	// A function that removes all event listeners
	const removeEvents = () => {
		eventRemovers.forEach((fn) => fn());
		eventRemovers = [];
	};

	// Unique id used to attach events to the element
	const id = uuid();

	// A function that attaches an event listener to the element
	const attach: Attach = (event, listener, options) => {
		if (!isBrowser) return;

		// Wait for the next tick to ensure that the element has been rendered
		tick().then(() => {
			const element = getElementByMeltId(id);
			element?.addEventListener(event, listener, options);
		});

		// Add a function to the `eventRemovers` array that removes the event listener
		eventRemovers.push(() => {
			const element = getElementByMeltId(id);
			element?.removeEventListener(event, listener, options);
		});
	};

	// Function that returns the element with the current `id`
	attach.getElement = () =>
		tick().then(() => {
			if (!isBrowser) return null;
			return getElementByMeltId(id);
		});

	return derived(stores, ($storeValues) => {
		// Remove all event listeners
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
 * Creates a derived store that contains a function that can be called on multiple elements.
 * The function returned by the derived store takes a variable number of arguments and
 * returns an object that includes a `data-melt-id` attribute. The `data-melt-id` attribute is
 * a unique identifier that is used to attach events to the elements.
 *
 * @template S - The type of the stores object
 * @template T - The type of the function that will be called on multiple elements
 * @param stores - The stores object to derive from
 * @param fn - The function to call on multiple elements
 * @returns A derived store that contains the function to call on multiple elements
 */
export function elementMultiDerived<
	S extends Stores,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => Record<string, unknown> | void
>(stores: S, fn: (values: StoresValues<S>, createAttach: () => Attach) => T) {
	// An array of functions that will be called to unsubscribe from events
	let unsubscribers: (() => void)[] = [];

	// Unique id used to attach events to the elements
	let id = uuid();

	// Create an `Attach` function that can be used to attach events to the elements
	const createAttach = () => {
		// Generate a new id for each call to `createAttach`
		id = uuid();

		// Function that attaches an event listener to an element
		const attach: Attach = (event, listener, options) => {
			if (!isBrowser) return;

			// Wait for the next tick to ensure that the element has been rendered
			tick().then(() => {
				const element = getElementByMeltId(id);
				element?.addEventListener(event, listener, options);
			});

			// Add a function to the `unsubscribers` array that removes the event listener
			unsubscribers.push(() => {
				const element = getElementByMeltId(id);
				element?.removeEventListener(event, listener, options);
			});
		};

		// A function that returns the element associated with the current `id`
		attach.getElement = () =>
			tick().then(() => {
				if (!isBrowser) return null;
				return getElementByMeltId(id);
			});

		return attach;
	};

	return derived(stores, ($storeValues) => {
		// Unsubscribe from all events
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];

		const returned = fn($storeValues, createAttach);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (...args: any[]) => {
			return { ...returned(...args), 'data-melt-id': id };
		};
	}) as Readable<(...args: Parameters<T>) => ReturnWithObj<T, { 'data-melt-id': string }>>;
}

/**
 * A utility function that creates a multi-element component from a function that
 * returns an object of attributes for each element.
 *
 * @template T - The type of the function that returns the attributes object
 * @param fn - The function that returns the attributes object
 * @returns A function that can be used to render the multi-element component
 */
export function elementMulti<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => Record<string, unknown> | void
>(fn: (createAttach: () => Attach) => T) {
	// Create a derived store that contains the attributes for each element
	return elementMultiDerived([], (_, createAttach) => fn(createAttach));
}
