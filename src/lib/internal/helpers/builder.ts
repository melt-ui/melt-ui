import { onDestroy, tick } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import { addEventListener, isBrowser, uuid } from '.';
import type { Action } from 'svelte/action';

export function getElementByMeltId(id: string) {
	if (!isBrowser) return null;
	return document.querySelector(`[data-melt-id="${id}"]`) as HTMLElement | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionParameters<T extends Action> = T extends Action<HTMLElement, infer P, any> ? P : never;

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
export type Attach = <T extends keyof HTMLElementEventMap>(
	type: T,
	listener: (ev: HTMLElementEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions
) => void;

type AddUnsubscriber = (cb: (() => void) | Array<undefined | (() => void)>) => void;

type GetElement = () => Promise<HTMLElement | null>;

type AddAction = <T extends Action>(action: T, parameters?: ActionParameters<T>) => void;

type Helpers = {
	attach: Attach;
	addUnsubscriber: AddUnsubscriber;
	getElement: GetElement;
	addAction: AddAction;
};

type MultiHelpers = Helpers & {
	index: number;
	getAllElements: () => Array<HTMLElement | null>;
};

const initElementHelpers = (setId: (id: string) => void) => {
	let unsubscribers: (() => void)[] = [];
	const unsubscribe = () => {
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
	};

	let index = 0;
	let ids: string[] = [];

	// Create an `Attach` function that can be used to attach events to the elements
	const createElInterface = () => {
		const id = uuid();
		ids.push(id);
		setId(id);

		addUnsubscriber(() => {
			ids = ids.filter((i) => i !== id);
			index--;
		});

		// Function that attaches an event listener to an element
		const attach: Attach = async (event, listener, options) => {
			if (!isBrowser) return;
			const element = await getElement();
			if (!element) return;
			unsubscribers.push(addEventListener(element, event, listener, options));
		};

		// A function that returns the element associated with the current `id`
		const getElement: Helpers['getElement'] = async () => {
			if (!isBrowser) return null;

			const el = getElementByMeltId(id);
			if (!el) {
				return await tick().then(() => getElementByMeltId(id));
			}

			return el;
		};

		const addAction: AddAction = async (action, parameters) => {
			const element = await getElement();
			if (!element) return;

			const ac = action(element, parameters);
			if (ac) {
				unsubscribers.push(() => ac.destroy?.());
			}
		};

		return { attach, getElement, addAction, index: index++ };
	};

	const addUnsubscriber: AddUnsubscriber = (cb) => {
		if (Array.isArray(cb)) {
			unsubscribers.push(...(cb.filter((a) => a !== undefined) as (() => void)[]));
		} else {
			unsubscribers.push(cb);
		}
	};

	const getAllElements = () => {
		return ids.map((id) => getElementByMeltId(id));
	};

	return {
		unsubscribe,
		createElInterface,
		addUnsubscriber,
		getAllElements,
	};
};

type ReturnWithObj<T extends () => void, Obj> = ReturnType<T> extends void
	? Obj
	: ReturnType<T> & Obj;

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
	fn: (values: StoresValues<S>, helpers: Helpers) => T
) {
	let id: string;
	const { addUnsubscriber, createElInterface, unsubscribe } = initElementHelpers(
		(newId) => (id = newId)
	);
	const { attach, getElement, addAction } = createElInterface();

	return derived(stores, ($storeValues) => {
		unsubscribe();
		return {
			...fn($storeValues, { attach, getElement, addUnsubscriber, addAction }),
			'data-melt-id': id,
		};
	});
}

/**
 * A utility function that creates a element component from a function that
 * returns an object of attributes for each element.
 *
 * @template T - The type of the function that returns the attributes object
 * @param fn - The function that returns the attributes object
 * @returns An object that contains the attributes for each element
 */
export function element<T extends Record<string, unknown>>(fn: (helpers: Helpers) => T) {
	return elementDerived([], (_, helpers) => fn(helpers));
}

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
>(stores: S, fn: (values: StoresValues<S>, helpers: MultiHelpers) => T) {
	let id: string;
	const { addUnsubscriber, createElInterface, unsubscribe, getAllElements } = initElementHelpers(
		(newId) => (id = newId)
	);

	return {
		...(derived(stores, ($storeValues) => {
			// Unsubscribe from all events
			unsubscribe();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (...args: any[]) => {
				const { attach, getElement, addAction, index } = createElInterface();
				const returned = fn($storeValues, {
					attach,
					getElement,
					addUnsubscriber,
					addAction,
					index,
					getAllElements,
				});
				return { ...returned(...args), 'data-melt-id': id };
			};
		}) as Readable<(...args: Parameters<T>) => ReturnWithObj<T, { 'data-melt-id': string }>>),
		getAllElements,
	};
}

/**
 * A utility function that creates a multi-element component from a function that
 * returns another function, that in turn returns an object of attributes for each element.
 *
 * @template T - The type of the function that returns the attributes object
 * @param fn - The function that returns the attributes object
 * @returns A function that can be used to render the multi-element component
 */
export function elementMulti<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => Record<string, unknown> | void
>(fn: (helpers: Helpers) => T) {
	return elementMultiDerived([], (_, helpers) => fn(helpers));
}
