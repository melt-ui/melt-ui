import { writable } from 'svelte/store';

export function controllableState<T>(initialState: T, setter: (newState: T) => void) {
	const store = writable<T>(initialState);

	const set: typeof store.set = (newState: T) => {
		setter(newState);
		store.set(newState);
	};

	const update: typeof store.update = (updater: (state: T) => T) => {
		store.update((v) => {
			const newState = updater(v);
			setter(newState);
			return newState;
		});
	};

	return {
		...store,
		set,
		update
	};
}
