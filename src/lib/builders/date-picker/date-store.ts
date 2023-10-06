import { get, type Writable } from 'svelte/store';
import djs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
	type CalendarDate,
	ZonedDateTime,
	type CalendarDateTime,
	type CycleOptions,
	type CycleTimeOptions,
	type DateDuration,
	type DateField,
	type DateFields,
	type DateTimeDuration,
	type DateValue,
	type Disambiguation,
	type TimeField,
	type TimeFields,
	getLocalTimeZone,
} from '@internationalized/date';

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

type AnyDateTime = ZonedDateTime | CalendarDateTime;

type MappedDuration<T> = T extends AnyDateTime
	? DateTimeDuration
	: T extends CalendarDate
	? DateDuration
	: never;

type MappedFields<T> = T extends AnyDateTime
	? DateFields & TimeFields
	: T extends CalendarDate
	? DateFields
	: never;

type MappedField<T> = T extends AnyDateTime
	? DateField | TimeField
	: T extends CalendarDate
	? DateField
	: never;

type MappedCycleOptions<T> = T extends AnyDateTime ? CycleTimeOptions : CycleOptions;

export function dateStore<T extends DateValue>(store: Writable<T>) {
	const originalValue = get(store);

	const { set, update, subscribe } = store;

	function add(duration: MappedDuration<T>) {
		update((d) => {
			return d.add(duration) as T;
		});
	}

	function subtract(duration: MappedDuration<T>) {
		update((d) => {
			return d.subtract(duration) as T;
		});
	}

	function setDate(
		fields: MappedFields<T>,
		disambiguation?: T extends ZonedDateTime ? Disambiguation : never
	) {
		if (disambiguation) {
			update((d) => {
				return d.set(fields, disambiguation) as T;
			});
			return;
		}

		update((d) => {
			return d.set(fields) as T;
		});
	}

	function cycle(field: MappedField<T>, amount: number, options?: MappedCycleOptions<T>) {
		update((d) => {
			//@ts-expect-error - need to figure out how to type this
			return d.cycle(field, amount, options) as T;
		});
	}

	function reset() {
		update(() => {
			return originalValue;
		});
	}

	function compare(b: CalendarDate | CalendarDateTime | ZonedDateTime) {
		return get(store).compare(b);
	}

	function toString() {
		return get(store).toString();
	}

	function copy() {
		return get(store) as T;
	}

	function toDateWithTz(timeZone?: string, disambiguation?: Disambiguation) {
		if (!timeZone) {
			return get(store).toDate(getLocalTimeZone());
		}
		return get(store).toDate(timeZone, disambiguation);
	}

	function toDateZoned() {
		const $storeValue = get(store) as ZonedDateTime;
		return $storeValue.toDate();
	}

	function isZoned() {
		const $storeValue = get(store);
		if ($storeValue instanceof ZonedDateTime) {
			return true;
		}
		return false;
	}

	function daysInMonth() {
		const $storeValue = get(store);
		const year = $storeValue.year;
		const month = $storeValue.month;
		return new Date(year, month, 0).getDate();
	}

	const toDate = isZoned() ? toDateZoned : toDateWithTz;

	return {
		set,
		update,
		subscribe,
		add,
		subtract,
		setDate,
		reset,
		cycle,
		compare,
		toDate,
		copy,
		toString,
		daysInMonth,
	};
}

export type DateStore<T> = Writable<T> & {
	add: (duration: MappedDuration<T>) => void;
	subtract: (duration: MappedDuration<T>) => void;
	setDate: (
		fields: MappedFields<T>,
		disambiguation?: T extends ZonedDateTime ? Disambiguation : never
	) => void;
	cycle: (field: MappedField<T>, amount: number, options?: MappedCycleOptions<T>) => void;
	reset: () => void;
	compare: (b: CalendarDate | CalendarDateTime | ZonedDateTime) => number;
	toString: () => string;
	copy: () => T;
	toDate: () => Date;
	isZoned: () => boolean;
	daysInMonth: () => number;
};
