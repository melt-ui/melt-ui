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
	executeCallbacks,
	styleToString,
} from '$lib/internal/helpers/index.js';

import {
	isSameDay,
	getDaysBetween,
	isSelected,
	isMatch,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isSingleDate,
	isInSameMonth,
	isToday,
} from '$lib/builders/calendar/utils.js';

import { derived, get, writable, type Writable } from 'svelte/store';
import { createPopover, type DateProps, type Month } from '$lib/builders/index.js';
import type { CreateDatePickerProps } from './types.js';
import dayjs from 'dayjs';
import { dayJsStore } from './date-store.js';
import { createSegments, handleSegmentNavigation, isSegmentNavigationKey } from './segments.js';

const defaults = {
	disabled: false,
	unavailable: false,
	value: undefined,
	activeDate: new Date(),
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	defaultValue: undefined,
	onValueChange: undefined,
	fixedWeeks: false,
	hourCycle: 24,
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	defaultOpen: false,
	disableFocusTrap: false,
	closeOnEscape: true,
	preventScroll: false,
	onOpenChange: undefined,
	closeOnOutsideClick: true,
	portal: undefined,
	forceVisible: false,
	calendarLabel: 'Date Picker',
} satisfies CreateDatePickerProps;

const defaultTriggerAttrs = {
	'data-segment': '',
};

/**
 * For internal use only.
 * @internal
 */
export type _DatePickerParts =
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'grid'
	| 'cell'
	| 'next'
	| 'prev'
	| 'date-input'
	| 'month-segment'
	| 'day-segment'
	| 'year-segment'
	| 'hour-segment'
	| 'minute-segment'
	| 'second-segment'
	| 'dayPeriod-segment'
	| 'trigger';

const { name } = createElHelpers<_DatePickerParts>('calendar');

/**
 * For internal use only.
 * @internal
 */
export type _DatePickerStores = {
	value: Writable<Date | undefined>;
	activeDate: ReturnType<typeof dayJsStore>;
};

/**
 * For internal use only.
 * @internal
 */
export type _DatePickerIds = {
	grid: string;
	input: string;
	daySegment: string;
	monthSegment: string;
	yearSegment: string;
	hourSegment: string;
	minuteSegment: string;
	secondSegment: string;
	timeIndicatorSegment: string;
	accessibleHeading: string;
	content: string;
	trigger: string;
};

export function createDatePicker(props?: CreateDatePickerProps) {
	const withDefaults = { ...defaults, ...props };

	const popover = createPopover({
		positioning: withDefaults.positioning,
		arrowSize: withDefaults.arrowSize,
		defaultOpen: withDefaults.defaultOpen,
		open: withDefaults.open,
		disableFocusTrap: withDefaults.disableFocusTrap,
		closeOnEscape: withDefaults.closeOnEscape,
		preventScroll: withDefaults.preventScroll,
		onOpenChange: withDefaults.onOpenChange,
		closeOnOutsideClick: withDefaults.closeOnOutsideClick,
		portal: withDefaults.portal,
		forceVisible: withDefaults.forceVisible,
		attrs: {
			trigger: {
				...defaultTriggerAttrs,
			},
		},
		handlers: {
			trigger: {
				keydown: handleTriggerKeydown,
			},
		},
	});

	const options = toWritableStores({
		...omit(withDefaults, 'value'),
		...popover.options,
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);

	const stores: _DatePickerStores = {
		value: overridable<Date | undefined>(
			valueWritable,
			withDefaults?.onValueChange as ChangeFn<Date | undefined>
		),
		activeDate: dayJsStore(options.activeDate),
	};

	const { value, activeDate } = stores;

	const {
		allowDeselect,
		disabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		calendarLabel,
		unavailable,
		hourCycle,
	} = options;

	const months = writable<Month[]>([]);

	const ids: _DatePickerIds = {
		grid: generateId(),
		input: generateId(),
		daySegment: generateId(),
		monthSegment: generateId(),
		yearSegment: generateId(),
		hourSegment: generateId(),
		minuteSegment: generateId(),
		secondSegment: generateId(),
		timeIndicatorSegment: generateId(),
		accessibleHeading: generateId(),
		...popover.ids,
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

	const grid = builder(name('grid'), {
		returned: () => ({ tabindex: -1, id: ids.grid }),
		action: (node: HTMLElement) => {
			/**
			 * Create the accessible heading for the calendar
			 * when the grid is mounted. The label is updated
			 * via an effect when the active date or label changes.
			 */
			createAccessibleHeading(node, get(calendarLabel));

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

	const dateInput = builder(name('date-input'), {
		returned: () => {
			return {
				role: 'group',
				id: ids.input,
			};
		},
	});

	/**
	 * An individual date cell in the calendar grid, which represents a
	 * single day in the month.
	 */
	const cell = builder(name('cell'), {
		stores: [value, disabled, unavailable, activeDate],
		returned: ([$value, $disabled, $unavailable, $activeDate]) => {
			return (props: DateProps) => {
				const isDisabled = isMatch(props.value, $disabled);
				const isUnavailable = isMatch(props.value, $unavailable);
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
					'data-unavailable': isUnavailable ? '' : undefined,
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
					handleSingleClick(date);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const segments = createSegments({
		stores,
		ids,
		options: {
			hourCycle,
		},
	});

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			e.preventDefault();
			handleSegmentNavigation(e, ids.input);
		}
	}

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

	/**
	 * A derived store whose value is an array of dates that represent
	 * the days of the week, used to render the days of the week in the
	 * calendar header.
	 *
	 * This remains in sync with the `weekStartsOn` option, so if it is
	 * changed, this store and the calendar will update accordingly.
	 */
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

	/**
	 * Given a date, this function will return an object containing
	 * the necessary values to render a calendar month, including
	 * the month's date, which can be used to render the name of the
	 * month, the dates within that month, and the dates from the
	 * previous and next months that are needed to fill out the
	 * calendar grid.
	 */
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

	function createAccessibleHeading(node: HTMLElement, label: string) {
		if (!isBrowser) return;
		const div = document.createElement('div');
		div.style.cssText = styleToString({
			border: '0px',
			clip: 'rect(0px, 0px, 0px, 0px)',
			'clip-path': 'inset(50%)',
			height: '1px',
			margin: '-1px',
			overflow: 'hidden',
			padding: '0px',
			position: 'absolute',
			'white-space': 'nowrap',
			width: '1px',
		});
		const h2 = document.createElement('h2');
		h2.textContent = label;
		h2.id = ids.accessibleHeading;
		node.insertBefore(div, node.firstChild);
		div.appendChild(h2);
	}

	/**
	 * Update the accessible heading's text content when the
	 * `calendarLabel` store changes.
	 */
	effect([calendarLabel], ([$calendarLabel]) => {
		if (!isBrowser) return;
		const node = document.getElementById(ids.accessibleHeading);
		if (!isHTMLElement(node)) return;
		node.textContent = $calendarLabel;
	});

	return {
		elements: {
			grid,
			cell,
			dateInput,
			...segments.elements,
			...popover.elements,
		},
		states: {
			activeDate,
			months,
			value,
			daysOfWeek,
			...segments.states,
			...popover.states,
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
		ids,
	};
}
