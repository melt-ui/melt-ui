import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateIds,
	isBrowser,
	isHTMLElement,
	isValidIndex,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';

import {
	areAllDaysBetweenValid,
	createFormatter,
	createMonths,
	dateStore,
	getAnnouncer,
	getDefaultDate,
	getSelectableCells,
	isAfter,
	isBefore,
	isBetweenInclusive,
	isCalendarCell,
	parseStringToDateValue,
	setPlaceholderToNodeValue,
	toDate,
	type Month,
} from '$lib/internal/helpers/date/index.js';
import { withGet } from '$lib/internal/helpers/withGet.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import {
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
	type DateValue,
} from '@internationalized/date';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { RangeCalendarEvents } from './events.js';
import type { CreateRangeCalendarProps } from './types.js';

const defaults = {
	isDateDisabled: undefined,
	isDateUnavailable: undefined,
	value: undefined,
	defaultValue: {
		start: undefined,
		end: undefined,
	},
	preventDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	fixedWeeks: false,
	calendarLabel: 'Event Date',
	locale: 'en',
	minValue: undefined,
	maxValue: undefined,
	disabled: false,
	readonly: false,
	weekdayFormat: 'narrow',
} satisfies CreateRangeCalendarProps;

/**
 * For internal use only.
 * @internal
 */
type CalendarParts = 'content' | 'nextButton' | 'prevButton' | 'grid' | 'cell' | 'heading';
const { name } = createElHelpers<CalendarParts>('calendar');

export const rangeCalendarIdParts = ['calendar', 'accessibleHeading'] as const;
export type RangeCalendarIdParts = typeof rangeCalendarIdParts;

export function createRangeCalendar<T extends DateValue = DateValue>(
	props?: CreateRangeCalendarProps
) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholder'),
	});

	const {
		preventDeselect,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		calendarLabel,
		locale,
		minValue,
		maxValue,
		disabled,
		readonly,
		weekdayFormat,
	} = options;

	const ids = toWritableStores({ ...generateIds(rangeCalendarIdParts), ...withDefaults.ids });

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholder: withDefaults.defaultPlaceholder,
	});
	const formatter = createFormatter(locale.get());
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const startValue = withGet(
		writable<DateValue | undefined>(value.get().start ?? withDefaults.defaultValue?.start)
	);
	const endValue = withGet(
		writable<DateValue | undefined>(value.get().end ?? withDefaults.defaultValue?.end)
	);

	const placeholderWritable =
		withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
	const placeholder = dateStore(
		overridable(placeholderWritable, withDefaults.onPlaceholderChange),
		withDefaults.defaultPlaceholder ?? defaultDate
	);

	const focusedValue = writable<DateValue | null>(null);

	const lastPressedDateValue = withGet(writable<DateValue | null>(null));

	const months = withGet(
		writable<Month<DateValue>[]>(
			createMonths({
				dateObj: placeholder.get(),
				weekStartsOn: withDefaults.weekStartsOn,
				locale: withDefaults.locale,
				fixedWeeks: withDefaults.fixedWeeks,
				numberOfMonths: withDefaults.numberOfMonths,
			})
		)
	);

	/**
	 * A derived store that maintains the currently visible months in the calendar,
	 * which we use to determine how keyboard navigation and if we should apply
	 * `data-outside-month` to cells.
	 */
	const visibleMonths = withGet(
		derived([months], ([$months]) => {
			return $months.map((month) => {
				return month.value;
			});
		})
	);

	const isOutsideVisibleMonths = derived([visibleMonths], ([$visibleMonths]) => {
		return (date: DateValue) => {
			return !$visibleMonths.some((month) => isSameMonth(date, month));
		};
	});

	const isDateDisabled = withGet(
		derived(
			[options.isDateDisabled, minValue, maxValue],
			([$isDateDisabled, $minValue, $maxValue]) => {
				return (date: DateValue) => {
					if ($isDateDisabled?.(date)) return true;
					if ($minValue && isBefore(date, $minValue)) return true;
					if ($maxValue && isAfter(date, $maxValue)) return true;
					return false;
				};
			}
		)
	);

	const isDateUnavailable = withGet(
		derived([options.isDateUnavailable], ([$isDateUnavailable]) => {
			return (date: DateValue) => {
				if ($isDateUnavailable?.(date)) return true;
				return false;
			};
		})
	);

	const isStartInvalid = derived(
		[startValue, isDateUnavailable, isDateDisabled],
		([$startValue, $isDateUnavailable, $isDateDisabled]) => {
			if (!$startValue) return false;
			return $isDateUnavailable($startValue) || $isDateDisabled($startValue);
		}
	);
	const isEndInvalid = derived(
		[endValue, isDateUnavailable, isDateDisabled],
		([$endValue, $isDateUnavailable, $isDateDisabled]) => {
			if (!$endValue) return false;
			return $isDateUnavailable($endValue) || $isDateDisabled($endValue);
		}
	);

	const isInvalid = derived(
		[startValue, endValue, isEndInvalid, isStartInvalid],
		([$startValue, $endValue, $isEndInvalid, $isStartInvalid]) => {
			if ($isStartInvalid || $isEndInvalid) {
				return true;
			}
			if ($endValue && $startValue && isBefore($endValue, $startValue)) {
				return true;
			}
			return false;
		}
	);

	const isNextButtonDisabled = withGet(
		derived([months, maxValue, disabled], ([$months, $maxValue, $disabled]) => {
			if (!$maxValue || !$months.length) return false;
			if ($disabled) return true;
			const lastMonthInView = $months[$months.length - 1].value;
			const firstMonthOfNextPage = lastMonthInView.add({ months: 1 }).set({ day: 1 });
			return isAfter(firstMonthOfNextPage, $maxValue);
		})
	);

	const isPrevButtonDisabled = withGet(
		derived([months, minValue, disabled], ([$months, $minValue, $disabled]) => {
			if (!$minValue || !$months.length) return false;
			if ($disabled) return true;
			const firstMonthInView = $months[0].value;
			const lastMonthOfPrevPage = firstMonthInView.subtract({ months: 1 }).set({ day: 35 });
			return isBefore(lastMonthOfPrevPage, $minValue);
		})
	);

	let announcer = getAnnouncer();

	const headingValue = derived([months, locale], ([$months, $locale]) => {
		if (!$months.length) return '';
		if ($locale !== formatter.getLocale()) {
			formatter.setLocale($locale);
		}
		if ($months.length === 1) {
			const month = toDate($months[0].value);
			return `${formatter.fullMonthAndYear(month)}`;
		}

		const startMonth = toDate($months[0].value);
		const endMonth = toDate($months[$months.length - 1].value);

		const startMonthName = formatter.fullMonth(startMonth);
		const endMonthName = formatter.fullMonth(endMonth);
		const startMonthYear = formatter.fullYear(startMonth);
		const endMonthYear = formatter.fullYear(endMonth);

		const content =
			startMonthYear === endMonthYear
				? `${startMonthName} - ${endMonthName} ${endMonthYear}`
				: `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;

		return content;
	});

	const fullCalendarLabel = withGet(
		derived([headingValue, calendarLabel], ([$headingValue, $calendarLabel]) => {
			return `${$calendarLabel}, ${$headingValue}`;
		})
	);

	const calendar = builder(name(), {
		stores: [fullCalendarLabel, isInvalid, ids.calendar, disabled, readonly],
		returned: ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]) => {
			return {
				id: $calendarId,
				role: 'application',
				'aria-label': $fullCalendarLabel,
				'data-invalid': $isInvalid ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
				'data-readonly': $readonly ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<RangeCalendarEvents['calendar']> => {
			/**
			 * Create the accessible heading for the calendar
			 * when the grid is mounted. The label is updated
			 * via an effect when the active date or label changes.
			 */
			createAccessibleHeading(node, fullCalendarLabel.get());
			announcer = getAnnouncer();

			const unsubKb = addMeltEventListener(node, 'keydown', handleCalendarKeydown);

			return {
				destroy() {
					unsubKb();
				},
			};
		},
	});

	const heading = builder(name('heading'), {
		stores: [disabled],
		returned: ([$disabled]) => {
			return {
				'aria-hidden': true,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
	});

	const grid = builder(name('grid'), {
		stores: [readonly, disabled],
		returned: ([$readonly, $disabled]) => ({
			tabindex: -1,
			role: 'grid',
			'aria-readonly': $readonly ? ('true' as const) : undefined,
			'aria-disabled': $disabled ? ('true' as const) : undefined,
			'data-readonly': $readonly ? '' : undefined,
			'data-disabled': $disabled ? '' : undefined,
		}),
	});

	const prevButton = builder(name('prevButton'), {
		stores: [isPrevButtonDisabled],
		returned: ([$isPrevButtonDisabled]) => {
			const disabled = $isPrevButtonDisabled;
			return {
				role: 'button',
				'aria-label': 'Previous',
				'aria-disabled': disabled ? ('true' as const) : undefined,
				disabled: disabled ? true : undefined,
				'data-disabled': disabled ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<RangeCalendarEvents['prevButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					prevPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const nextButton = builder(name('nextButton'), {
		stores: [isNextButtonDisabled],
		returned: ([$isNextButtonDisabled]) => {
			const disabled = $isNextButtonDisabled;
			return {
				role: 'button',
				'aria-label': 'Next',
				'aria-disabled': disabled ? ('true' as const) : undefined,
				disabled: disabled ? true : undefined,
				'data-disabled': disabled ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<RangeCalendarEvents['nextButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					nextPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const isSelectionStart = derived([startValue], ([$startValue]) => {
		return (date: DateValue) => {
			if (!$startValue) return false;
			return isSameDay($startValue, date);
		};
	});

	const isSelectionEnd = derived([endValue], ([$endValue]) => {
		return (date: DateValue) => {
			if (!$endValue) return false;
			return isSameDay($endValue, date);
		};
	});

	const isSelected = derived([startValue, endValue], ([$startValue, $endValue]) => {
		return (date: DateValue) => {
			if ($startValue && isSameDay($startValue, date)) return true;
			if ($endValue && isSameDay($endValue, date)) return true;
			if ($endValue && $startValue) {
				return isBetweenInclusive(date, $startValue, $endValue);
			}
			return false;
		};
	});

	const highlightedRange = withGet(
		derived(
			[startValue, endValue, focusedValue, isDateDisabled, isDateUnavailable],
			([$startValue, $endValue, $focusedValue, $isDateDisabled, $isDateUnavailable]) => {
				if ($startValue && $endValue) return null;
				if (!$startValue || !$focusedValue) return null;
				const isStartBeforeFocused = isBefore($startValue, $focusedValue);
				const start = isStartBeforeFocused ? $startValue : $focusedValue;
				const end = isStartBeforeFocused ? $focusedValue : $startValue;

				if (isSameDay(start.add({ days: 1 }), end)) {
					return {
						start: start,
						end: end,
					};
				}

				const isValid = areAllDaysBetweenValid(start, end, $isDateUnavailable, $isDateDisabled);
				if (isValid) {
					return {
						start: start,
						end: end,
					};
				}
				return null;
			}
		)
	);

	/**
	 * An individual date cell in the calendar grid, which represents a
	 * single day in the month.
	 */
	const cell = builder(name('cell'), {
		stores: [
			isSelected,
			isSelectionEnd,
			isSelectionStart,
			highlightedRange,
			isDateDisabled,
			isDateUnavailable,
			placeholder,
			isOutsideVisibleMonths,
		],
		returned: ([
			$isSelected,
			$isSelectionEnd,
			$isSelectionStart,
			$highlightedRange,
			$isDateDisabled,
			$isDateUnavailable,
			$placeholder,
			$isOutsideVisibleMonths,
		]) => {
			return (cellValue: T, monthValue: T) => {
				const cellDate = toDate(cellValue);
				const isDisabled = $isDateDisabled(cellValue);
				const isUnavailable = $isDateUnavailable(cellValue);
				const isDateToday = isToday(cellValue, getLocalTimeZone());
				const isOutsideMonth = !isSameMonth(cellValue, monthValue);
				const isFocusedDate = isSameDay(cellValue, $placeholder);
				const isOutsideVisibleMonths = $isOutsideVisibleMonths(cellValue);
				const isSelectedDate = $isSelected(cellValue);
				const isSelectionStart = $isSelectionStart(cellValue);
				const isSelectionEnd = $isSelectionEnd(cellValue);
				const isHighlighted = $highlightedRange
					? isBetweenInclusive(cellValue, $highlightedRange.start, $highlightedRange.end)
					: false;

				const labelText = formatter.custom(cellDate, {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				});

				return {
					role: 'button',
					'aria-label': labelText,
					'aria-selected': isSelectedDate ? true : undefined,
					'aria-disabled': isOutsideMonth || isDisabled || isUnavailable ? true : undefined,
					'data-selected': isSelectedDate ? true : undefined,
					'data-selection-start': isSelectionStart ? true : undefined,
					'data-selection-end': isSelectionEnd ? true : undefined,
					'data-value': cellValue.toString(),
					'data-disabled': isDisabled || isOutsideMonth ? '' : undefined,
					'data-unavailable': isUnavailable ? '' : undefined,
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isOutsideMonth ? '' : undefined,
					'data-outside-visible-months': isOutsideVisibleMonths ? '' : undefined,
					'data-focused': isFocusedDate ? '' : undefined,
					'data-highlighted': isHighlighted ? '' : undefined,
					tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? undefined : -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<RangeCalendarEvents['cell']> => {
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
				addMeltEventListener(node, 'click', (e) => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					handleCellClick(e, parseStringToDateValue(args.value, placeholder.get()));
				}),
				addMeltEventListener(node, 'mouseenter', () => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					focusedValue.set(parseStringToDateValue(args.value, placeholder.get()));
				}),
				addMeltEventListener(node, 'focusin', () => {
					const args = getElArgs();
					if (args.disabled) return;
					if (!args.value) return;
					focusedValue.set(parseStringToDateValue(args.value, placeholder.get()));
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	/**
	 * Updates the displayed months based on changes in the placeholder value,
	 * which determines the months to show in the calendar.
	 */
	effect(
		[placeholder, weekStartsOn, locale, fixedWeeks, numberOfMonths],
		([$placeholder, $weekStartsOn, $locale, $fixedWeeks, $numberOfMonths]) => {
			if (!isBrowser || !$placeholder) return;

			const $visibleMonths = visibleMonths.get();

			/**
			 * If the placeholder's month is already in the visible months,
			 * we don't need to do anything.
			 */
			if ($visibleMonths.some((month) => isSameMonth(month, $placeholder))) {
				return;
			}

			const defaultMonthProps = {
				weekStartsOn: $weekStartsOn,
				locale: $locale,
				fixedWeeks: $fixedWeeks,
				numberOfMonths: $numberOfMonths,
			};

			months.set(
				createMonths({
					...defaultMonthProps,
					dateObj: $placeholder,
				})
			);
		}
	);

	/**
	 * Update the accessible heading's text content when the
	 * `fullCalendarLabel` store changes.
	 */
	effect([fullCalendarLabel], ([$fullCalendarLabel]) => {
		if (!isBrowser) return;
		const node = document.getElementById(ids.accessibleHeading.get());
		if (!isHTMLElement(node)) return;
		node.textContent = $fullCalendarLabel;
	});

	effect([startValue], ([$startValue]) => {
		if ($startValue && placeholder.get() !== $startValue) {
			placeholder.set($startValue);
		}
	});

	/**
	 * A derived store whose value is an array days of the week
	 * for the current locale and calendar view.
	 *
	 * This remains in sync with the `weekStartsOn` prop, so if it is
	 * changed, this store and the calendar will update accordingly.
	 *
	 * If you prefer to format/render the days of the week yourself,
	 * you can do so by accessing the first week of the first month,
	 * and mapping over the dates to get/format each day of the week.
	 */
	const weekdays = derived([months, weekdayFormat, locale], ([$months, $weekdayFormat, _]) => {
		if (!$months.length) return [];
		return $months[0].weeks[0].map((date) => {
			return formatter.dayOfWeek(toDate(date), $weekdayFormat);
		});
	});

	/**
	 * Creates an accessible heading for the calendar so when it
	 * is focused by a screen reader, the date range being displayed
	 * is announced.
	 */
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
		const h2 = document.createElement('div');
		h2.textContent = label;
		h2.id = ids.accessibleHeading.get();
		h2.role = 'heading';
		h2.ariaLevel = '2';
		node.insertBefore(div, node.firstChild);
		div.appendChild(h2);
	}

	/**
	 * Navigate to the next page of the calendar.
	 *
	 * @remarks
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 *  import { prev } from '../../internal/helpers/array'
	 * 	const { { ... }, helpers: { nextPage } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={nextPage} aria-label="Next page">▶️</button>
	 * ```
	 */
	function nextPage() {
		const $months = months.get();
		const $numberOfMonths = numberOfMonths.get();
		if (pagedNavigation.get()) {
			const firstMonth = $months[0].value;
			placeholder.set(firstMonth.add({ months: $numberOfMonths }));
		} else {
			const firstMonth = $months[0].value;
			const newMonths = createMonths({
				dateObj: firstMonth.add({ months: 1 }),
				weekStartsOn: weekStartsOn.get(),
				locale: locale.get(),
				fixedWeeks: fixedWeeks.get(),
				numberOfMonths: $numberOfMonths,
			});

			months.set(newMonths);
			placeholder.set(newMonths[0].value.set({ day: 1 }));
		}
	}

	/**
	 * Navigate to the previous page of the calendar.
	 *
	 * @remarks
	 * A helper function to navigate to the previous page of the calendar.
	 * If using paged navigation, this will move the calendar backwards
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar backwards
	 * by one month.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { prevPage } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevPage} aria-label="Previous page">◀️</button>
	 * ```
	 */
	function prevPage() {
		const $months = months.get();
		const $numberOfMonths = numberOfMonths.get();
		if (pagedNavigation.get()) {
			const firstMonth = $months[0].value;
			placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
		} else {
			const firstMonth = $months[0].value;
			const newMonths = createMonths({
				dateObj: firstMonth.subtract({ months: 1 }),
				weekStartsOn: weekStartsOn.get(),
				locale: locale.get(),
				fixedWeeks: fixedWeeks.get(),
				numberOfMonths: $numberOfMonths,
			});

			months.set(newMonths);
			placeholder.set(newMonths[0].value.set({ day: 1 }));
		}
	}

	/**
	 * Navigate to the previous year of the calendar.
	 */
	function nextYear() {
		placeholder.add({ years: 1 });
	}

	/**
	 * Navigate to the next year of the calendar.
	 */
	function prevYear() {
		placeholder.subtract({ years: 1 });
	}

	const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];

	/**
	 * A helper function to set the year of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * year of the calendar.
	 */
	function setYear(year: number) {
		placeholder.setDate({ year: year });
	}

	/**
	 * A helper function to set the month of the active date. This is
	 * useful when the user wants to have a select input to change the
	 * month of the calendar.
	 */
	function setMonth(month: number) {
		if (month < 0 || month > 11) throw new Error('Month must be between 0 and 11');
		placeholder.setDate({ month: month });
	}

	function handleCellClick(e: Event, date: DateValue) {
		const $isDateDisabled = isDateDisabled.get();
		const $isDateUnavailable = isDateUnavailable.get();
		if ($isDateDisabled(date) || $isDateUnavailable(date)) return;
		const $lastPressedDate = lastPressedDateValue.get();
		lastPressedDateValue.set(date);

		const $startValue = startValue.get();
		const $endValue = endValue.get();
		const $highlightedRange = highlightedRange.get();

		if ($startValue && $highlightedRange === null) {
			if (isSameDay($startValue, date) && !preventDeselect.get() && !$endValue) {
				startValue.set(undefined);
				placeholder.set(date);
				announcer.announce('Selected date is now empty.', 'polite');
				return;
			} else if (!$endValue) {
				e.preventDefault();
				if ($lastPressedDate && isSameDay($lastPressedDate, date)) {
					startValue.set(date);
					announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
				}
				return;
			}
		}

		if ($startValue && isSameDay($startValue, date) && !preventDeselect.get() && !$endValue) {
			startValue.set(undefined);
			placeholder.set(date);
			announcer.announce('Selected date is now empty.', 'polite');
			return;
		}

		if (!$startValue) {
			startValue.update(() => {
				announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
				return date;
			});
		} else if (!$endValue) {
			endValue.update(() => {
				announcer.announce(
					`Selected Dates: ${formatter.selectedDate(
						$startValue,
						false
					)} to ${formatter.selectedDate(date, false)}`,
					'polite'
				);
				return date;
			});
		} else if ($endValue && $startValue) {
			endValue.set(undefined);
			startValue.update(() => {
				announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
				return date;
			});
		}
	}

	const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];

	function handleCalendarKeydown(e: KeyboardEvent) {
		const currentCell = e.target;
		if (!isCalendarCell(currentCell)) return;
		if (!ARROW_KEYS.includes(e.key) && !SELECT_KEYS.includes(e.key)) return;

		e.preventDefault();
		// the cell that is currently focused

		if (e.key === kbd.ARROW_DOWN) {
			shiftFocus(currentCell, 7);
		}
		if (e.key === kbd.ARROW_UP) {
			shiftFocus(currentCell, -7);
		}
		if (e.key === kbd.ARROW_LEFT) {
			shiftFocus(currentCell, -1);
		}
		if (e.key === kbd.ARROW_RIGHT) {
			shiftFocus(currentCell, 1);
		}

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			const cellValue = currentCell.getAttribute('data-value');
			if (!cellValue) return;

			handleCellClick(e, parseStringToDateValue(cellValue, placeholder.get()));
		}
	}

	function shiftFocus(node: HTMLElement, add: number) {
		const $calendarId = ids.calendar.get();
		const candidateCells = getSelectableCells($calendarId);
		if (!candidateCells.length) {
			return;
		}

		const index = candidateCells.indexOf(node);
		const nextIndex = index + add;

		/**
		 * If the next cell is within the bounds of the
		 * displayed/rendered cells, easy day, just focus it.
		 */
		if (isValidIndex(nextIndex, candidateCells)) {
			const nextCell = candidateCells[nextIndex];
			setPlaceholderToNodeValue(nextCell, placeholder);
			return nextCell.focus();
		}

		/**
		 * If the next cell is outside the bounds of the
		 * displayed/rendered cells, we need to updated the focused
		 * value to the prev/next month depending on the direction,
		 * and then focus the appropriate cell.
		 */

		if (nextIndex < 0) {
			/**
			 * Since we're in the negative index range, we need to
			 * go back a month, refetch the candidate cells within that
			 * month, and then starting at the end of that array, shift
			 * focus by the difference between the nextIndex
			 */

			// shift the calendar back a month unless previous month is disabled
			if (isPrevButtonDisabled.get()) return;

			const $months = months.get();
			const firstMonth = $months[0].value;
			const $numberOfMonths = numberOfMonths.get();
			placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));

			// Without a tick here, it seems to be too fast for
			// the DOM to update, with the tick it works great
			tick().then(() => {
				const newCandidateCells = getSelectableCells($calendarId);
				if (!newCandidateCells.length) {
					return;
				}

				// starting at the end of the array, shift focus by the nextIndex amount
				// since in this case, nextIndex is negative, we'll convert it to a positive
				// before subtracting it from the length of the array
				const newIndex = newCandidateCells.length - Math.abs(nextIndex);
				if (isValidIndex(newIndex, newCandidateCells)) {
					const newCell = newCandidateCells[newIndex];
					setPlaceholderToNodeValue(newCell, placeholder);
					return newCell.focus();
				}
			});
		}

		if (nextIndex >= candidateCells.length) {
			/**
			 * Since we're in the positive index range, we need to
			 * go forward a month, refetch the candidate cells within that
			 * month, and then starting at the beginning of that array,
			 * shift focus by the nextIndex amount.
			 */

			// shift the calendar forward a month unless next month is disabled
			if (isNextButtonDisabled.get()) return;

			const $months = months.get();
			const firstMonth = $months[0].value;
			const $numberOfMonths = numberOfMonths.get();
			placeholder.set(firstMonth.add({ months: $numberOfMonths }));

			tick().then(() => {
				const newCandidateCells = getSelectableCells($calendarId);
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * We need to determine how far into the next month we need to go
				 * to get the next index. So if we only went over the previous month
				 * by 1, we need to go into the next month by 1 to get the right index.
				 */
				const newIndex = nextIndex - candidateCells.length;

				if (isValidIndex(newIndex, newCandidateCells)) {
					const nextCell = newCandidateCells[newIndex];
					return nextCell.focus();
				}
			});
		}
	}

	/**
	 * A helper function to determine if a date is disabled,
	 * which uses the `Matcher`(s) provided via the `disabled`
	 * prop, as well as other internal logic, such as if the
	 * date is outside of the current month.
	 *
	 * Although we set attributes on the cells themselves, this
	 * function is useful when you want to conditionally handle
	 * something outside of the cell, such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * 	<td role="gridcell" aria-disabled={$isDisabled(date)}>
	 * 		<!-- ... -->
	 * 	</td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const _isDateDisabled = derived(
		[isDateDisabled, placeholder, minValue, maxValue],
		([$isDateDisabled, $placeholder, $minValue, $maxValue]) => {
			return (date: DateValue) => {
				if ($isDateDisabled(date)) return true;
				if ($minValue && isBefore(date, $minValue)) return true;
				if ($maxValue && isAfter(date, $maxValue)) return true;
				if (!isSameMonth(date, $placeholder)) return true;
				return false;
			};
		}
	);

	/**
	 * Synchronize the `value` store with the individual `startValue`
	 * and `endValue` stores that are used by the individual date fields.
	 *
	 * We only want to update the `value` store when both the `startValue`
	 * and `endValue` stores are not `undefined`. This is because the
	 * `value` store is used to determine if the date field is completed,
	 * and we don't want to mark the date field as completed until both
	 * the start and end dates have been selected.
	 */

	effect([value], ([$value]) => {
		const $startValue = startValue.get();
		const $endValue = endValue.get();

		if ($value?.start && $value?.end) {
			if ($value.start !== $startValue) {
				startValue.set($value.start);
			}
			if ($value.end !== $endValue) {
				endValue.set($value.end);
			}
			return;
		}
	});

	effect([startValue, endValue], ([$startValue, $endValue]) => {
		const $value = value.get();

		if ($value && $value?.start === $startValue && $value?.end === $endValue) return;

		if ($startValue && $endValue) {
			value.update((prev) => {
				if (prev?.start === $startValue && prev?.end === $endValue) {
					return prev;
				}
				if (isBefore($endValue, $startValue)) {
					return {
						start: $endValue,
						end: $startValue,
					};
				} else {
					return {
						start: $startValue,
						end: $endValue,
					};
				}
			});
		} else if ($value && $value.start && $value.end) {
			value.set({
				start: undefined,
				end: undefined,
			});
		}
	});

	return {
		elements: {
			calendar,
			heading,
			grid,
			cell,
			nextButton,
			prevButton,
		},
		states: {
			placeholder: placeholder.toWritable(),
			months,
			weekdays,
			headingValue,
			value,
			startValue,
			endValue,
		},
		helpers: {
			nextPage,
			prevPage,
			nextYear,
			prevYear,
			setYear,
			setMonth,
			isDateDisabled: _isDateDisabled,
			isDateUnavailable,
		},
		options,
		ids,
	};
}
