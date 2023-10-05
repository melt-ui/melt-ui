import { get, type Writable } from 'svelte/store';
import djs from 'dayjs';
import type { Dayjs } from 'dayjs';

/**
 * A higher order store that wraps a writable date store and adds
 * some convenience methods for manipulating the date using dayjs.
 */
export function dayJsStore(store: Writable<Date>) {
	const originalValue = get(store);

	const { set, update, subscribe } = store;

	function add(...args: Parameters<typeof Dayjs.prototype.add>) {
		update((d) => {
			return djs(d)
				.add(...args)
				.toDate();
		});
	}

	function subtract(...args: Parameters<typeof Dayjs.prototype.subtract>) {
		update((d) => {
			return djs(d)
				.subtract(...args)
				.toDate();
		});
	}

	function setDate(dayInMonth: number) {
		update((d) => {
			return djs(d).set('date', dayInMonth).toDate();
		});
	}

	function setMonth(month: number) {
		update((d) => {
			return djs(d).set('month', month).toDate();
		});
	}

	function setYear(year: number) {
		update((d) => {
			return djs(d).set('year', year).toDate();
		});
	}

	function setHour(hour: number) {
		update((d) => {
			return djs(d).set('hour', hour).toDate();
		});
	}

	function setMinute(minute: number) {
		update((d) => {
			return djs(d).set('minute', minute).toDate();
		});
	}

	function setSecond(second: number) {
		update((d) => {
			return djs(d).set('second', second).toDate();
		});
	}

	function reset() {
		update(() => {
			return originalValue;
		});
	}

	return {
		set,
		update,
		subscribe,
		add,
		subtract,
		setDate,
		setMonth,
		setYear,
		setHour,
		setMinute,
		setSecond,
		reset,
	};
}
