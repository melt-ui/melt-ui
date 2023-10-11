import type { Writable } from 'svelte/store';
import type {
	CalendarDate,
	ZonedDateTime,
	CalendarDateTime,
	DateDuration,
	DateFields,
	DateTimeDuration,
	DateValue,
	Disambiguation,
	TimeFields,
} from '@internationalized/date';

type AnyDateTime = ZonedDateTime | CalendarDateTime;

type DerivedDuration<T> = T extends AnyDateTime
	? DateTimeDuration
	: T extends CalendarDate
	? DateDuration
	: never;

type DerivedFields<T> = T extends AnyDateTime
	? DateFields & TimeFields
	: T extends CalendarDate
	? DateFields
	: never;

/**
 * A higher order store that wraps a writable store containing
 * a `DateValue` from `@internationalized/date` and provides a
 * set of methods to easily manipulate the date value.
 *
 * @see [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
 */
export function dateStore<T extends DateValue>(store: Writable<T>, defaultValue: T) {
	const { set, update, subscribe } = store;

	function add(duration: DerivedDuration<T>) {
		update((d) => {
			return d.add(duration) as T;
		});
	}

	function nextPage(amount: number) {
		update((d) => {
			return d.set({ day: 1 }).add({ months: amount }) as T;
		});
	}

	function prevPage(amount: number) {
		update((d) => {
			return d.set({ day: 1 }).subtract({ months: amount }) as T;
		});
	}

	function subtract(duration: DerivedDuration<T>) {
		update((d) => {
			return d.subtract(duration) as T;
		});
	}

	function setDate(
		fields: DerivedFields<T>,
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

	function reset() {
		update(() => {
			return defaultValue;
		});
	}

	function toWritable() {
		return {
			set,
			subscribe,
			update,
		};
	}

	return {
		set,
		update,
		subscribe,
		add,
		subtract,
		setDate,
		reset,
		toWritable,
		nextPage,
		prevPage,
	};
}

export type DateStore<T> = Writable<T> & {
	add: (duration: DerivedDuration<T>) => void;
	subtract: (duration: DerivedDuration<T>) => void;
	setDate: (
		fields: DerivedFields<T>,
		disambiguation?: T extends ZonedDateTime ? Disambiguation : never
	) => void;
	reset: () => void;
	nextPage: (amount: number) => void;
	prevPage: (amount: number) => void;
};
