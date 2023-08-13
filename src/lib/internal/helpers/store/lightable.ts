import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';

export function lightable<T>(value: T): Readable<T> {
	function subscribe(run: Subscriber<T>): Unsubscriber {
		run(value);
		return () => {
			// don't need to unsub from anything
		};
	}
	return { subscribe };
}
