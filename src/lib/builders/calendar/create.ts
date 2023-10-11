import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	toWritableStores,
	omit,
	executeCallbacks,
	styleToString,
	chunk,
	overridable,
	isValidIndex,
} from '$lib/internal/helpers/index.js';
import {
	getDaysBetween,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isCalendarCell,
} from './utils.js';
import { derived, get, writable } from 'svelte/store';
import type { CalendarIds, CreateCalendarProps, Month } from './types.js';
import { tick } from 'svelte';
import { getAnnouncer, parseStringToDateValue, toDate } from '$lib/internal/date/index.js';
import {
	type DateValue,
	getLocalTimeZone,
	isToday,
	isSameMonth,
	isSameDay,
	startOfMonth,
	endOfMonth,
	ZonedDateTime,
} from '@internationalized/date';
import {
	dateStore,
	createFormatter,
	getDaysInMonth,
	getDefaultDate,
} from '$lib/internal/date/index.js';

const defaults = {
	isDisabled: undefined,
	isUnavailable: undefined,
	value: undefined,
	allowDeselect: false,
	numberOfMonths: 1,
	pagedNavigation: false,
	weekStartsOn: 0,
	fixedWeeks: false,
	calendarLabel: 'Event Date',
	locale: 'en',
} satisfies CreateCalendarProps;

/**
 * For internal use only.
 * @internal
 */
type CalendarParts = 'content' | 'nextButton' | 'prevButton' | 'grid' | 'cell' | 'heading';

const { name } = createElHelpers<CalendarParts>('calendar');

export function createCalendar<T extends DateValue = DateValue>(props?: CreateCalendarProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores({
		...omit(withDefaults, 'value', 'placeholderValue'),
	});

	const {
		allowDeselect,
		isDisabled,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		calendarLabel,
		isUnavailable,
		locale,
	} = options;

	const ids = {
		calendar: generateId(),
		grid: generateId(),
		accessibleHeading: generateId(),
	} satisfies CalendarIds;

	const defaultDate = getDefaultDate({
		defaultPlaceholderValue: withDefaults.defaultPlaceholderValue,
		defaultValue: withDefaults.defaultValue,
	});

	const formatter = createFormatter(withDefaults.locale);
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.defaultPlaceholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const months = writable<Month<DateValue>[]>([
		createMonth(withDefaults.defaultPlaceholderValue ?? defaultDate),
	]);

	/**
	 * A derived helper store that is true if the currently
	 * selected date is invalid, based on the `isDisabled`,
	 * and `isUnavailable` matchers passed as props.
	 */
	const isInvalid = derived(
		[value, isDisabled, isUnavailable],
		([$value, $isDisabled, $isUnavailable]) => {
			if (!$value) return false;
			if ($isDisabled?.($value)) return true;
			if ($isUnavailable?.($value)) return true;
			return false;
		}
	);

	/**
	 * Initialize the announcer, which doesn't do anything
	 * here, as this will be SSR'd, but we will update it
	 * in the action of the calendar builder.
	 *
	 * The announcer is responsible for `aria-live` announcements
	 * for the calendar, such as when a date is selected.
	 */
	let announcer = getAnnouncer();

	/**
	 * The current heading value for the calender, which
	 * should be used alongside the `heading` builder to
	 * render what month and year is currently being displayed
	 * in the calendar, formatted for the current locale.
	 *
	 * This automatically updates as the user navigates the
	 * calendar, and also accounts for multiple months being
	 * displayed at once if displaying multiple months via
	 * the `numberOfMonths` prop.
	 */
	const headingValue = derived([months, locale], ([$months, $locale]) => {
		if (!$months.length) return '';
		if ($locale !== formatter.getLocale()) {
			formatter.setLocale($locale);
		}
		if ($months.length === 1) {
			const month = $months[0].monthDate;
			return `${formatter.fullMonthAndYear(month)}`;
		}

		const startMonth = $months[0].monthDate;
		const endMonth = $months[$months.length - 1].monthDate;

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

	/**
	 * The accessible heading label for the calender,
	 * which is a combination of the `calendarLabel`
	 * prop and the `headingValue` store, to read
	 * something like `Event Date, January 2021`.
	 */
	const fullCalendarLabel = derived(
		[headingValue, calendarLabel],
		([$headingValue, $calendarLabel]) => {
			return `${$calendarLabel}, ${$headingValue}`;
		}
	);

	/**
	 * The root element for the calendar, which can
	 * contain multiple grids/months if using paged
	 * navigation.
	 */
	const calendar = builder(name(), {
		stores: [fullCalendarLabel, isInvalid],
		returned: ([$fullCalendarLabel, $isInvalid]) => {
			return {
				id: ids.calendar,
				role: 'application',
				'aria-label': $fullCalendarLabel,
				'data-invalid': $isInvalid ? '' : undefined,
			};
		},
		action: (node: HTMLElement) => {
			/**
			 * Create the accessible heading for the calendar
			 * when the grid is mounted. The label is updated
			 * via an effect when the active date or label changes.
			 */
			createAccessibleHeading(node, get(fullCalendarLabel));
			announcer = getAnnouncer();

			const unsubKb = addMeltEventListener(node, 'keydown', handleCalendarKeydown);

			return {
				destroy() {
					unsubKb();
				},
			};
		},
	});

	/**
	 * The heading for the calendar, used to visually
	 * display the current month and year. This is hidden
	 * from screen readers, as an accessible heading is
	 * automatically created for the calendar.
	 *
	 * If you want to change what that heading says, you
	 * can use the `calendarLabel` prop to change the
	 * prefix of the accessible heading.
	 *
	 * By default, the accessible heading will be read as
	 * `Event Date, January 2021` if the current month is
	 * January 2021.
	 *
	 * If you pass a `calendarLabel` prop of `Booking Date`,
	 * the accessible heading will be read as `Booking Date,
	 * January 2021` if the current month is January 2021.
	 */
	const heading = builder(name('heading'), {
		returned: () => {
			return {
				'aria-hidden': true,
			};
		},
	});

	/**
	 * A grid element responsible for containing a single
	 * month of the calendar. Grids should be rendered for
	 * each month in the `months` store returned by the
	 * `createCalendar` builder.
	 */
	const grid = builder(name('grid'), {
		returned: () => ({ tabindex: -1, id: ids.grid, role: 'grid' }),
	});

	/**
	 * The prev button for the calendar, which is used to
	 * navigate to the previous page of the calendar. If using
	 * paged navigation, this will move the calendar backwards
	 * by the number of months specified in the `numberOfMonths`
	 * prop. If not using paged navigation, this will move the
	 * calendar backwards by one month.
	 */
	const prevButton = builder(name('prevButton'), {
		returned: () => {
			return {
				role: 'button',
				'aria-label': 'Previous',
			};
		},
		action: (node: HTMLElement) => {
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

	/**
	 * A button element responsible for navigating to the
	 * next page of the calendar. If using paged navigation,
	 * moves the calendar forward by the number of months
	 * specified in the `numberOfMonths` prop. If not using
	 * paged navigation, moves the calendar forward by one month.
	 */
	const nextButton = builder(name('nextButton'), {
		returned: () => {
			return {
				role: 'button',
				'aria-label': 'Next',
			};
		},
		action: (node: HTMLElement) => {
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

	/**
	 * An individual date cell in the calendar grid, which
	 * represents a single day in the month. Applies the
	 * necessary attributes and event handlers to make the
	 * cell accessible and interactive.
	 */
	const cell = builder(name('cell'), {
		stores: [value, isDisabled, isUnavailable, placeholderValue],
		returned: ([$value, $isDisabled, $isUnavailable, $placeholderValue]) => {
			return (cellValue: T) => {
				const cellDate = toDate(cellValue);
				const isDisabled = $isDisabled?.(cellValue);
				const isUnavailable = $isUnavailable?.(cellValue);
				const isDateToday = isToday(cellValue, getLocalTimeZone());
				const isOutsideMonth = !isSameMonth(cellValue, $placeholderValue);
				const isFocusedDate = isSameDay(cellValue, $placeholderValue);
				const isSelectedDate = $value ? isSameDay(cellValue, $value) : false;

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
					'data-value': cellValue.toString(),
					'data-disabled': isDisabled || isOutsideMonth ? '' : undefined,
					'data-unavailable': isUnavailable ? '' : undefined,
					'data-date': '',
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isOutsideMonth ? '' : undefined,
					'data-focused': isFocusedDate ? '' : undefined,
					tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? undefined : -1,
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
					if (!args.value) return;
					handleCellClick(parseStringToDateValue(args.value, get(placeholderValue)));
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	/**
	 * Keep the locale used within the formatter in
	 * sync with the `locale` store so dynamic updates
	 * are reflected in the calendar.
	 */
	effect([locale], ([$locale]) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	/**
	 * Handles updating the months when the placeholder value
	 * changes, which is the value used to determine what
	 * months to display in the calendar.
	 */
	effect([placeholderValue], ([$placeholderValue]) => {
		if (!isBrowser || !$placeholderValue) return;

		months.set([createMonth($placeholderValue)]);
		const $numberOfMonths = get(numberOfMonths);
		if ($numberOfMonths > 1) {
			for (let i = 1; i < $numberOfMonths; i++) {
				const nextMonth = $placeholderValue.add({ months: i });
				months.update((prev) => {
					prev.push(createMonth(nextMonth));
					return prev;
				});
			}
		}
	});

	/**
	 * Update the accessible heading's text content when the
	 * `fullCalendarLabel` store changes.
	 */
	effect([fullCalendarLabel], ([$fullCalendarLabel]) => {
		if (!isBrowser) return;
		const node = document.getElementById(ids.accessibleHeading);
		if (!isHTMLElement(node)) return;
		node.textContent = $fullCalendarLabel;
	});

	/**
	 * Keeping the placeholder value in sync with the value.
	 */
	effect([value], ([$value]) => {
		if ($value && get(placeholderValue) !== $value) {
			placeholderValue.set($value);
		}
	});

	/**
	 * A derived store whose value is an array of strings with the
	 * days of the week for the current locale and calendar view.
	 * This remains in sync with the `weekStartsOn` option, so if
	 * it is changed, this store will update accordingly.
	 *
	 * It's highly recommended you use this store to render the
	 * days of the week in your calendar, as it will ensure the days
	 * are formatted correctly for the current locale and calendar view.
	 *
	 * @example
	 *
	 * ```svelte
	 * <table use:melt={$grid} class="w-full">
	 * 	<thead aria-hidden="true">
	 * 		<tr>
	 * 			{#each $daysOfWeek as day}
	 * 				<th class="text-sm font-semibold text-magnum-800">
	 * 					<div class="flex h-6 w-6 items-center justify-center p-4">
	 * 						{day}
	 * 					</div>
	 * 				</th>
	 * 			{/each}
	 * 		</tr>
	 * 	</thead>
	 * 	<!-- ... -->
	 * </table>
	 * ```
	 *
	 * If you prefer to format/render the days of the week yourself,
	 * you can do so by accessing the first week of the first month,
	 * and mapping over the dates to get/format each day of the week.
	 *
	 *
	 * @example
	 *
	 * ```svelte
	 * {#each $months as month}
	 * 	<table use:melt={$grid} class="w-full">
	 * 		<thead aria-hidden="true">
	 * 			<tr>
	 * 				{#each month.weeks[0] as dayOfWeek}
	 * 					<th class="text-sm font-semibold text-magnum-800">
	 * 						<div class="flex h-6 w-6 items-center justify-center p-4">
	 * 							{new Intl.DateTimeFormat('en', { weekday: 'long' }).format
	 * 							(dayOfWeek)}
	 * 						</div>
	 * 					</th>
	 * 				{/each}
	 * 			</tr>
	 * 		</thead>
	 * 		<!-- ... -->
	 * 	</table>
	 * {/each}
	 * ```
	 *
	 */
	const daysOfWeek = derived([months], ([$months]) => {
		if (!$months.length) return [];
		return $months[0].weeks[0].map((date) => {
			return formatter.dayOfWeek(toDate(date));
		});
	});

	/**
	 * Given a date, this function will return an object containing
	 * the necessary values to render a calendar month, including
	 * the month's date (which is the first day of that month), which
	 * can be used to render the name of the month, as well as an array
	 * of all dates in that month, and an array of weeks, where each
	 * week is an array of dates, useful for rendering an accessible
	 * calendar grid using a loop and table elements.
	 */
	function createMonth(dateObj: DateValue): Month<DateValue> {
		const tz = getLocalTimeZone();
		const date = dateObj instanceof ZonedDateTime ? dateObj.toDate() : dateObj.toDate(tz);
		const daysInMonth = getDaysInMonth(date);

		const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));

		const firstDayOfMonth = startOfMonth(dateObj);
		const lastDayOfMonth = endOfMonth(dateObj);

		const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, get(weekStartsOn), get(locale));
		const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, get(weekStartsOn), get(locale));

		const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
		const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));

		const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

		if (get(fixedWeeks) && totalDays < 42) {
			const extraDays = 42 - totalDays;

			const startFrom = nextMonthDays[nextMonthDays.length - 1];
			const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
				const incr = i + 1;
				return startFrom.add({ days: incr });
			});
			nextMonthDays.push(...extraDaysArray);
		}

		const allDays = lastMonthDays.concat(datesArray, nextMonthDays);

		const weeks = chunk(allDays, 7);

		return {
			monthDate: date,
			dates: allDays,
			weeks,
		};
	}

	/**
	 * Creates an accessible heading for the calendar so when it
	 * is focused by a screen reader, the date range being displayed
	 * is announced.
	 *
	 * This is to ensure that the calendar is accessible to screen readers,
	 * and the heading is hidden from view so it doesn't interfere with
	 * the visual design of the calendar.
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
		const h2 = document.createElement('h2');
		h2.textContent = label;
		h2.id = ids.accessibleHeading;
		node.insertBefore(div, node.firstChild);
		div.appendChild(h2);
	}

	/**
	 * A helper function to navigate to the next page of the calendar.
	 * If using paged navigation, this will move the calendar forward
	 * by the number of months specified in the `numberOfMonths` prop.
	 * If not using paged navigation, this will move the calendar forward
	 * by one month.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextPage } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={nextPage} aria-label="Next page">▶️</button>
	 * ```
	 */
	function nextPage() {
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			placeholderValue.nextPage($numberOfMonths);
		} else {
			placeholderValue.nextPage(1);
		}
	}

	/**
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
		if (get(pagedNavigation)) {
			const $numberOfMonths = get(numberOfMonths);
			placeholderValue.prevPage($numberOfMonths);
		} else {
			placeholderValue.prevPage(1);
		}
	}

	/**
	 * A helper function to navigate to the next year in the calendar,
	 * which is useful if you want to extend the calendar to have buttons
	 * to navigate to the next/prev year.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextYear, prevYear } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevYear} aria-label="Previous year">◀️</button>
	 * <button on:click={nextYear} aria-label="Next year">▶️</button>
	 *
	 * ```
	 */
	function nextYear() {
		placeholderValue.add({ years: 1 });
	}

	/**
	 * A helper function to navigate to the previous year in the calendar,
	 * which is useful if you want to extend the calendar to have buttons
	 * to navigate to the next/prev year.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { nextYear, prevYear } } = createCalendar()
	 * </script>
	 *
	 * <button on:click={prevYear} aria-label="Previous year">◀️</button>
	 * <button on:click={nextYear} aria-label="Next year">▶️</button>
	 *
	 * ```
	 */
	function prevYear() {
		placeholderValue.subtract({ years: 1 });
	}

	const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];

	/**
	 * A helper function to set the year of the placeholder value's
	 * date. This is useful if you want to extend the calendar to have
	 * alternative ways to change the year, such as a select input.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { setYear } } = createCalendar()
	 *
	 * 	let selectValue = 2023;
	 * 	$: setYear(selectValue);
	 * </script>
	 *
	 * <select bind:value={selectValue} aria-label='Select a year'>
	 * 	<option value={2023}>2023</option>
	 * 	<option value={2024}>2024</option>
	 * 	<option value={2025}>2025</option>
	 * 	<!-- ... -->
	 * </select>
	 * ```
	 */
	function setYear(year: number) {
		placeholderValue.setDate({ year: year });
	}

	/**
	 * A helper function to set the month of the placeholder value's
	 * date. This is useful if you want to extend the calendar to have
	 * alternative ways to change the month, such as a select input.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { createCalendar } from '@melt-ui/svelte';
	 * 	const { { ... }, helpers: { setMonth } } = createCalendar()
	 *
	 * 	let selectValue = 1;
	 * 	$: setMonth(selectValue);
	 * </script>
	 *
	 * <select bind:value={selectValue} aria-label='Select a month'>
	 * 	<option value={1}>January</option>
	 * 	<option value={2}>February</option>
	 * 	<option value={3}>March</option>
	 * 	<!-- ... -->
	 * </select>
	 * ```
	 */
	function setMonth(month: number) {
		placeholderValue.setDate({ month: month });
	}

	function handleCellClick(date: DateValue) {
		value.update((prev) => {
			if (get(allowDeselect) && prev && isSameDay(prev, date)) {
				placeholderValue.set(date);
				announcer.announce('Selected date is now empty.', 'polite', 5000);
				return undefined;
			}
			announcer.announce(`Selected Date: ${formatter.selectedDate(date, false)}`, 'polite');
			return date;
		});
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

			handleCellClick(parseStringToDateValue(cellValue, get(placeholderValue)));
		}
	}

	function shiftFocus(node: HTMLElement, add: number) {
		// TODO: Determine if this is okay when using paged navigation
		// with multiple months.
		const candidateCells = getSelectableCells();
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
			handlePlaceholderValue(nextCell);
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

			// shift the calendar back a month
			placeholderValue.subtract({ months: 1 });

			// Without a tick here, it seems to be too fast for
			// the DOM to update, with the tick it works great
			tick().then(() => {
				const newCandidateCells = getSelectableCells();
				if (!newCandidateCells.length) {
					return;
				}

				// starting at the end of the array, shift focus by the nextIndex amount
				// since in this case, nextIndex is negative, we'll convert it to a positive
				// before subtracting it from the length of the array
				const newIndex = newCandidateCells.length - Math.abs(nextIndex);
				if (isValidIndex(newIndex, newCandidateCells)) {
					const newCell = newCandidateCells[newIndex];
					handlePlaceholderValue(newCell);
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

			// shift the calendar forward a month
			placeholderValue.add({ months: 1 });

			tick().then(() => {
				const newCandidateCells = getSelectableCells();
				if (!newCandidateCells.length) {
					return;
				}

				// We need to determine how far into the next month we need to go
				// to get the next index. So if we only went over the previous
				// month by 1, we need to go into the next month by 1 to get the
				// right index.
				const newIndex = nextIndex - candidateCells.length;

				if (isValidIndex(newIndex, newCandidateCells)) {
					const nextCell = newCandidateCells[newIndex];
					return nextCell.focus();
				}
			});
		}
	}

	function getSelectableCells() {
		const node = document.getElementById(ids.calendar);
		if (!node) return [];
		const selectableSelector = `[data-melt-calendar-cell]:not([data-disabled]):not([data-outside-month])`;

		return Array.from(node.querySelectorAll(selectableSelector)).filter((el): el is HTMLElement =>
			isHTMLElement(el)
		);
	}

	/**
	 * A helper function to extract the date from the `data-value`
	 * attribute of a date cell and set it as the placeholder value.
	 */
	function handlePlaceholderValue(node: HTMLElement) {
		const cellValue = node.getAttribute('data-value');
		if (!cellValue) return;
		placeholderValue.set(parseStringToDateValue(cellValue, get(placeholderValue)));
	}

	/**
	 * A helper function to determine if a date is disabled,
	 * which uses the `Matcher`(s) provided via the `isDisabled`
	 * prop, as well as other internal logic, that determines
	 * if a date is disabled, such as if it's outside of the
	 * month, or if it's before/after the min/max dates.
	 *
	 * Although we set attributes on the cells themselves, this
	 * function is useful when you want to conditionally handle
	 * something outside of the cell, such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * <td role="gridcell" aria-disabled={$isDisabled(date)}>
	 * 	<!-- ... -->
	 * </td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const isDateDisabled = derived(
		[isDisabled, placeholderValue],
		([$isDisabled, $placeholderValue]) => {
			return (date: DateValue) => {
				if ($isDisabled?.(date)) return true;
				if (!isSameMonth(date, $placeholderValue)) return true;
				return false;
			};
		}
	);

	/**
	 * A helper function to determine if a date is unavailable,
	 * which uses the `Matcher`(s) provided via the `unavailable`
	 * prop.
	 *
	 * Although we set attributes on the cells themselves, this
	 * function is useful when you want to conditionally handle
	 * something outside of the cell, such as its wrapping element.
	 *
	 * @example
	 * ```svelte
	 * {#each dates as date}
	 * <td role="gridcell">
	 * 	{#if $isUnavailable(date)}
	 * 		X
	 * 	{/if}
	 * 	<!-- ... -->
	 * </td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const isDateUnavailable = derived(isUnavailable, ($isUnavailable) => {
		return (date: DateValue) => $isUnavailable?.(date);
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
			placeholderValue: placeholderValue.toWritable(),
			months,
			value,
			daysOfWeek,
			headingValue,
		},
		helpers: {
			nextPage,
			prevPage,
			nextYear,
			prevYear,
			setYear,
			setMonth,
			isDateDisabled,
			isDateUnavailable,
		},
		options,
		ids,
	};
}
