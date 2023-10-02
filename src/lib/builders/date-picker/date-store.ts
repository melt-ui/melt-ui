import { get, type Writable } from 'svelte/store';
import djs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { getLocale, type Locale } from '$lib/internal/locale.js';
import { derivedWithUnsubscribe } from '$lib/internal/helpers';

/**
 * A higher order store that wraps a writable date store and adds
 * some convenience methods for manipulating the date using dayjs.
 */
export function dayJsStore(store: Writable<Date>, localeStore: Writable<Locale>) {
	const { set, update, subscribe } = store;

	let locale = initLocale(get(localeStore));

	const _ = derivedWithUnsubscribe(localeStore, ($locale) => {
		if ($locale !== locale) {
			setLocale($locale);
		}
	});

	function initLocale(initialLocale: Locale) {
		if (initialLocale !== 'en') {
			getLocale(initialLocale);
		}
		return initialLocale;
	}

	function setLocale(newLocale: Locale) {
		locale = newLocale;
		if (locale !== 'en') {
			getLocale(newLocale);
		}
	}

	function add(...args: Parameters<typeof Dayjs.prototype.add>) {
		update((d) => {
			return djs(d)
				.locale(locale)
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
