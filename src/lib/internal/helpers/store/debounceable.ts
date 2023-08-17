import { writable } from 'svelte/store';

export function debounceable<T>(initialValue: T, wait = 0) {
	const store = writable({ value: initialValue, debounced: initialValue });
	let timeout: NodeJS.Timeout | undefined;

	function set(value: T) {
		store.update((state) => {
			state.value = value;
			return state;
		});

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			store.update((state) => {
				state.debounced = state.value;
				return state;
			});
		}, wait);
	}

	function update(fn: (value: T) => T) {
		store.update((state) => {
			state.value = fn(state.value);
			return state;
		});

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			store.update((state) => {
				state.debounced = state.value;
				return state;
			});
		}, wait);
	}

	function forceSet(value: T) {
		store.update((state) => {
			state.value = value;
			state.debounced = value;
			return state;
		});
	}

	function forceUpdate(fn: (value: T) => T) {
		store.update((state) => {
			state.value = fn(state.value);
			state.debounced = state.value;
			return state;
		});
	}

	return {
		...store,
		set,
		update,
		forceSet,
		forceUpdate,
	};
}
