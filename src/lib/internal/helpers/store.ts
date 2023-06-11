import type { Readable, Writable } from 'svelte/store';

export function toReadable<T>(store: Writable<T>): Readable<T> {
	return {
		subscribe: store.subscribe,
	};
}
