import type { Updater, Writable } from 'svelte/store';

export type ChangeFn<T> = (args: { prev: T; next: T }) => T;

export const overridable = <T>(store: Writable<T>, onChange?: ChangeFn<T>) => {
	const update = (updater: Updater<T>, sideEffect?: (newValue: T) => void) => {
		store.update((prev) => {
			const next = updater(prev);
			let res: T = next;
			if (onChange) {
				res = onChange({ prev, next });
			}

			sideEffect?.(res);
			return res;
		});
	};

	const set: typeof store.set = (next) => {
		update(() => next);
	};

	return {
		...store,
		update,
		set,
	};
};
