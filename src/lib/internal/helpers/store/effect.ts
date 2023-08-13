import { onDestroy } from 'svelte';
import type { Stores, StoresValues } from 'svelte/store';
import { derivedWithUnsubscribe } from './derivedWithUnsubscribe';

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
