import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	overridable,
	toWritableStores,
	omit,
	type ChangeFn,
} from '$lib/internal/helpers';

import {
	isBefore,
	isSameDay,
	getDaysBetween,
	isSelected,
	isMatch,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isDateArray,
	isSingleDate,
	isDateRange,
	isInSameMonth,
	isToday,
} from './utils';

import { derived, get, writable } from 'svelte/store';
import type { CreateCalendarProps, DateProps, DateRange, Month } from './types';
import dayjs from 'dayjs';
import { dayJsStore } from './date-store';
import { executeCallbacks } from '../../internal/helpers/callbacks';

const defaults = {
	disabled: false,
	earliest: undefined,
	latest: undefined,
	mode: 'single',
	value: undefined,
	activeDate: new Date(),
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	hidden: false,
	defaultValue: undefined,
	onValueChange: undefined,
	fixedWeeks: false,
} satisfies CreateCalendarProps;

type CalendarParts =
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'date'
	| 'next'
	| 'prev';
const { name } = createElHelpers<CalendarParts>('calendar');

export function createCalendar(props?: CreateCalendarProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable<Date | Date[] | DateRange | undefined>(
		valueWritable,
		withDefaults?.onValueChange as ChangeFn<Date | Date[] | DateRange | undefined>
	);
	const activeDate = dayJsStore(options.activeDate);

	const {
		mode,
		allowDeselect,
		disabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		hidden,
	} = options;

	const months = writable<Month[]>([]);

	const ids = {
		content: generateId(),
		input: generateId(),
	};

	/**
	 * Navigate to the next page of the calendar.
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 */
	function nextMonth() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			activeDate.add($numberOfMonths, 'month');
		} else {
			activeDate.add(1, 'month');
		}
	}

	/**
	 * Navigate to the previous page of the calendar.
	 * If using paged navigation, this will move the calendar backwards
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar backwards
	 * by one month.
	 */
	function prevMonth() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			activeDate.subtract($numberOfMonths, 'month');
		} else {
			activeDate.subtract(1, 'month');
		}
	}

	/**
	 * Navigate to the previous year of the calendar.
	 */
	function nextYear() {
		activeDate.add(1, 'year');
	}

	/**
	 * Navigate to the next year of the calendar.
	 */
	function prevYear() {
		activeDate.subtract(1, 'year');
	}

	const content = builder(name('content'), {
		returned: () => ({ tabindex: -1, id: ids.content }),
		action: (node: HTMLElement) => {
			const unsubKb = addMeltEventListener(node, 'keydown', (e) => {
				const triggerElement = e.currentTarget;
				if (!isHTMLElement(triggerElement)) return;

				if ([kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT].includes(e.key)) {
					e.preventDefault();
					if (e.key === kbd.ARROW_RIGHT) {
						focusElement(1);
					} else if (e.key === kbd.ARROW_LEFT) {
						focusElement(-1);
					} else if (e.key === kbd.ARROW_UP) {
						focusElement(-7);
					} else if (e.key === kbd.ARROW_DOWN) {
						focusElement(7);
					}
				}
			});

			return {
				destroy() {
					unsubKb();
				},
			};
		},
	});

	function handleRangeClick(date: Date) {
		value.update((prev) => {
			if (prev === undefined) {
				return {
					from: date,
					to: date,
				};
			}
			if (!isDateRange(prev)) return prev;

			const isEmpty = prev.to === undefined && prev.from === undefined;
			const isSame = prev.to === prev.from;
			const isComplete = !isSame && prev.to !== undefined && prev.from !== undefined;

			if (isEmpty || isComplete) {
				return {
					from: date,
					to: date,
				};
			}

			// If the value array of dates has one date and the
			// new date is the same as the existing date
			if (prev.from !== undefined) {
				if (isSame && isSameDay(prev.from, date)) {
					return undefined;
				}

				if (isBefore(date, prev.from)) {
					return {
						from: date,
						to: prev.from,
					};
				}
				const daysBetween = getDaysBetween(prev.from, date);
				if (daysBetween.some((d) => isMatch(d, get(disabled)))) {
					return prev;
				}
			}
			prev.to = date;
			return prev;
		});
	}

	function handleSingleClick(date: Date) {
		value.update((prev) => {
			if (isSingleDate(prev) || prev === undefined) {
				if (!isInSameMonth(date, get(activeDate))) {
					activeDate.set(date);
				}

				if (prev === undefined) return date;
				if (get(allowDeselect) && isSameDay(prev, date)) {
					return undefined;
				}
			}
			return date;
		});
	}

	function handleMultipleClick(date: Date) {
		value.update((prev) => {
			if (prev === undefined) {
				return [date];
			}
			if (!isDateArray(prev)) return prev;
			if (prev.some((d) => isSameDay(d, date))) {
				prev = prev.filter((d) => !isSameDay(d, date));
			} else {
				prev.push(date);
			}

			return prev;
		});
	}

	const date = builder(name('date'), {
		stores: [value, disabled, hidden, activeDate],
		returned: ([$value, $disabled, $hidden, $activeDate]) => {
			return (props: DateProps) => {
				const isDisabled = isMatch(props.value, $disabled);
				const isHidden = isMatch(props.value, $hidden);
				const isDateToday = isToday(props.value);
				const isInCurrentMonth = isInSameMonth(props.value, $activeDate);

				const selected = isSelected({
					date: props.value,
					value: $value,
				});

				return {
					role: 'date',
					'aria-selected': selected ? true : undefined,
					'data-selected': selected ? true : undefined,
					'data-value': props.value,
					'data-label': props.label ?? undefined,
					'data-disabled': isDisabled ? '' : undefined,
					'data-hidden': isHidden ? '' : undefined,
					'data-date': '',
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isInCurrentMonth ? undefined : '',
					tabindex: isDisabled ? -1 : 1,
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			const getElArgs = () => {
				const value = node.getAttribute('data-value');
				const label = node.getAttribute('data-label');
				const disabled = node.hasAttribute('data-disabled');

				return {
					value,
					label: label ?? node.textContent ?? null,
					disabled: disabled ? true : false,
				};
			};
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const args = getElArgs();
					if (args.disabled) return;
					const date = new Date(args.value || '');

					switch (get(mode)) {
						case 'single':
							handleSingleClick(date);
							break;
						case 'range':
							handleRangeClick(date);
							break;
						case 'multiple':
							handleMultipleClick(date);
							break;
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	function focusElement(add: number) {
		const node = document.activeElement as HTMLElement;
		if (!node || node.hasAttribute('[data-melt-calendar-date]')) return;
		const allDates = Array.from(
			document.querySelectorAll<HTMLElement>(`[data-melt-calendar-date]:not([data-disabled])`)
		);
		const index = allDates.indexOf(node);
		const nextIndex = index + add;
		const nextDate = allDates[nextIndex];
		if (nextDate) {
			nextDate.focus();
		}
	}

	/**
	 * A helper function to set the year of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * year of the calendar.
	 */
	function setYear(year: number) {
		activeDate.update((prev) => {
			prev.setFullYear(year);
			return prev;
		});
	}

	/**
	 * A helper function to set the month of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * month of the calendar.
	 */
	function setMonth(month: number) {
		if (month < 0 || month > 11) throw new Error('Month must be between 0 and 11');
		activeDate.update((prev) => {
			prev.setMonth(month);
			return prev;
		});
	}

	effect([activeDate], ([$activeDate]) => {
		if (!isBrowser || !$activeDate) return;

		months.set([createMonth($activeDate)]);
		const $numberOfMonths = get(numberOfMonths);
		if ($numberOfMonths > 1) {
			const d = dayjs($activeDate);

			for (let i = 1; i < $numberOfMonths; i++) {
				const nextMonth = d.add(i, 'month').toDate();
				months.update((prev) => {
					prev.push(createMonth(nextMonth));
					return prev;
				});
			}
		}
	});

	const daysOfWeek = derived([months], ([$months]) => {
		if (!$months.length) return [];

		const lastMonthDates = $months[0].lastMonthDates;

		const days = Array.from({ length: 7 - lastMonthDates.length }, (_, i) => {
			const d = dayjs($months[0].dates[i]);
			return d.toDate();
		});

		if (lastMonthDates.length) {
			return lastMonthDates.concat(days);
		}

		return days;
	});

	function createMonth(date: Date): Month {
		const d = dayjs(date);
		const daysInMonth = d.daysInMonth();

		const datesArray = Array.from(
			{ length: daysInMonth },
			(_, i) => new Date(d.date(i + 1).toDate())
		);

		const firstDayOfMonth = d.startOf('month');
		const lastDayOfMonth = d.endOf('month');

		const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth.toDate(), get(weekStartsOn));
		const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth.toDate(), get(weekStartsOn));

		const lastMonthDays = getDaysBetween(
			dayjs(lastSunday).subtract(1, 'day').toDate(),
			firstDayOfMonth.toDate()
		);
		const nextMonthDays = getDaysBetween(
			lastDayOfMonth.toDate(),
			dayjs(nextSaturday).add(1, 'day').toDate()
		);

		const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

		if (get(fixedWeeks) && totalDays < 42) {
			const extraDays = 42 - totalDays;
			const startFrom = dayjs(nextMonthDays[nextMonthDays.length - 1]);
			const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
				const incr = i + 1;
				return startFrom.add(incr, 'day').toDate();
			});
			nextMonthDays.push(...extraDaysArray);
		}

		return {
			month: date,
			dates: datesArray,
			nextMonthDates: nextMonthDays,
			lastMonthDates: lastMonthDays,
		};
	}

	return {
		elements: {
			content,
			date,
		},
		states: {
			activeDate,
			months,
			value,
			daysOfWeek,
		},
		helpers: {
			nextMonth,
			prevMonth,
			nextYear,
			prevYear,
			setYear,
			setMonth,
		},
		options,
	};
}
