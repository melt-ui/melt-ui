import type { Writable } from 'svelte/store';
import dayjs, { Dayjs } from 'dayjs';

export function dayJsStore(store: Writable<Date>) {
	const { set, update, subscribe } = store;

	function add(...args: Parameters<typeof Dayjs.prototype.add>) {
		update((d) => {
			return dayjs(d)
				.add(...args)
				.toDate();
		});
	}

	function subtract(...args: Parameters<typeof Dayjs.prototype.subtract>) {
		update((d) => {
			return dayjs(d)
				.subtract(...args)
				.toDate();
		});
	}

	return {
		set,
		update,
		subscribe,
		add,
		subtract,
	};
}
