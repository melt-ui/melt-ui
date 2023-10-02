import type { Writable } from 'svelte/store';
import dayjs, { Dayjs } from 'dayjs';

/**
 * A higher order store that wraps a writable date store and adds
 * some convenience methods for manipulating the date using dayjs.
 */
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

	function setDate(dayInMonth: number) {
		update((d) => {
			return dayjs(d).set('date', dayInMonth).toDate();
		});
	}

	function setMonth(month: number) {
		update((d) => {
			return dayjs(d).set('month', month).toDate();
		});
	}

	function setYear(year: number) {
		update((d) => {
			return dayjs(d).set('year', year).toDate();
		});
	}

	function setHour(hour: number) {
		update((d) => {
			return dayjs(d).set('hour', hour).toDate();
		});
	}

	function setMinute(minute: number) {
		update((d) => {
			return dayjs(d).set('minute', minute).toDate();
		});
	}

	function setSecond(second: number) {
		update((d) => {
			return dayjs(d).set('second', second).toDate();
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
	};
}
