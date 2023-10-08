import { get, type Writable } from 'svelte/store';
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

export function dateStore<T extends DateValue>(store: Writable<T>, defaultValue: T) {
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
			return defaultValue;
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
