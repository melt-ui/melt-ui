import { writable, type Updater } from 'svelte/store';

export type SideEffect<T> = (newValue: T) => void;

export const withSideEffect = <T>(initialValue: T, sideEffect?: SideEffect<T>) => {
	const store = writable(initialValue);

	function update(updater: Updater<T>) {
		store.update((curr) => {
			const next = updater(curr);
			sideEffect?.(next);
			return next;
		});
	}

	const set: typeof store.set = (curr) => {
		update(() => curr);
	};

	return {
		...store,
		update,
		set,
	};
};
