import { onDestroy } from 'svelte';
import type { Action } from 'svelte/action';
import { derived, type Readable, type Subscriber, type Unsubscriber } from 'svelte/store';
import { isBrowser, noop } from '.';

export function getElementByMeltId(id: string) {
	if (!isBrowser) return null;
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

export function typedDerived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T
): Readable<ReturnType<typeof fn>> {
	return derived(stores, fn);
}

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

	const unsubscribe = () => {
		// Call all of the unsubscribe functions from the previous run of the function
		unsubscribers.forEach((fn) => fn());
		// Clear the list of unsubscribe functions
		unsubscribers = [];
	};

	const derivedStore = derived(stores, ($storeValues) => {
		unsubscribe();
		return fn($storeValues, onUnsubscribe);
	});

	onDestroy(unsubscribe);

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

export const hiddenAction = <T extends Record<string, unknown>>(obj: T) => {
	return new Proxy(obj, {
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver);
		},
		ownKeys(target) {
			return Reflect.ownKeys(target).filter((key) => key !== 'action');
		},
	});
};

export function lightable<T>(value: T): Readable<T> {
	function subscribe(run: Subscriber<T>): Unsubscriber {
		run(value);
		return () => {
			// don't need to unsub from anything
		};
	}
	return { subscribe };
}

type BuilderArgs<
	S extends Stores | undefined,
	A extends Action,
	R extends S extends Stores
		? (values: StoresValues<S>) => Record<string, any> | ((...args: any[]) => Record<string, any>)
		: () => Record<string, any> | ((...args: any[]) => Record<string, any>)
> = {
	stores?: S;
	action?: A;
	returned?: R;
};

const isFunctionn = (fn: unknown): fn is (...args: unknown[]) => unknown =>
	typeof fn === 'function';

export function builder<
	S extends Stores | undefined,
	A extends Action,
	R extends S extends Stores
		? (values: StoresValues<S>) => Record<string, any> | ((...args: any[]) => Record<string, any>)
		: () => Record<string, any> | ((...args: any[]) => Record<string, any>),
	Name extends string
>(name: Name, args?: BuilderArgs<S, A, R>) {
	const { stores, action, returned } = args ?? {};

	const derivedStore = (() => {
		if (stores && returned) {
			return derived(stores, (values) => {
				const result = returned(values);
				if (isFunctionn(result)) {
					return (...args: Parameters<typeof result>) => {
						return {
							...result(...args),
							'data-melt-part': name,
						};
					};
				}
				return {
					...result,
					'data-melt-part': name,
				};
			});
		} else {
			const returnedFn = returned as (() => R) | undefined;

			const result = returnedFn?.();
			if (isFunctionn(result)) {
				const resultFn = (...args: Parameters<typeof result>) => {
					return {
						...result(...args),
						'data-melt-part': name,
					};
				};
				return lightable(resultFn);
			}

			return lightable({
				...result,
				'data-melt-part': name,
			});
		}
	})() as Readable<ReturnType<R> & { 'data-melt-part': Name }>;

	return {
		...derivedStore,
		action: action ?? noop,
	};
}
