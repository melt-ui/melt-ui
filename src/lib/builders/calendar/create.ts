import {
	addMeltEventListener,
	createElHelpers,
	effect,
	executeCallbacks,
	generateIds,
	isBrowser,
	isHTMLElement,
	isValidIndex,
	kbd,
	makeElement,
	omit,
	parseProps,
	styleToString,
	toWritableStores,
	withGet,
	type WithGet,
} from '$lib/internal/helpers/index.js';

import {
	createFormatter,
	createMonths,
	dateStore,
	getAnnouncer,
	getDefaultDate,
	getSelectableCells,
	isAfter,
	isBefore,
	isCalendarCell,
	parseStringToDateValue,
	setPlaceholderToNodeValue,
	toDate,
	type Month,
} from '$lib/internal/helpers/date/index.js';
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
import type { CalendarEvents } from './events.js';
import type { CreateCalendarProps } from './types.js';
import type { Writable } from 'svelte/store';

const defaults = {
	isDateDisabled: undefined,
	isDateUnavailable: undefined,
	value: undefined,
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
	multiple: false,
} satisfies CreateCalendarProps;

type CalendarParts = 'content' | 'nextButton' | 'prevButton' | 'grid' | 'cell' | 'heading';

const { name } = createElHelpers<CalendarParts>('calendar');

export const calendarIdParts = ['calendar', 'accessibleHeading'] as const;
export type CalendarIdParts = typeof calendarIdParts;

export function createCalendar<Value extends DateValue = DateValue>(
	props?: CreateCalendarProps<Value>
) {
	const {
		value,
		placeholder: _placeholder,
		ids,
		...options
	} = parseProps({ props, defaults, idParts: calendarIdParts });

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
		multiple,
		isDateUnavailable,
		disabled,
		readonly,
		weekdayFormat,
	} = options;

	const defaultDate = getDefaultDate({
		defaultPlaceholder: _placeholder?.get(),
		defaultValue: value.get(),
	});

	const formatter = createFormatter(locale.get());

	const placeholderWritable = (_placeholder ?? withGet.writable(defaultDate)) as WithGet<
		Writable<DateValue>
	>;

	const placeholder = dateStore(placeholderWritable, placeholderWritable.get() ?? defaultDate);

	/**
	 * A store containing the months to display in the calendar.
	 */
	const months = withGet(
		writable<Month<DateValue>[]>(
			createMonths({
				dateObj: placeholder.get(),
				weekStartsOn: weekStartsOn.get(),
				locale: locale.get(),
				fixedWeeks: fixedWeeks.get(),
				numberOfMonths: numberOfMonths.get(),
			})
		)
	);

	/**
	 * A derived store that maintains the currently visible months in the calendar,
	 * which we use to determine how keyboard navigation and if we should apply
	 * `data-outside-month` to cells.
	 */
	const visibleMonths = withGet.derived([months], ([$months]) => {
		return $months.map((month) => {
			return month.value;
		});
	});

	const isOutsideVisibleMonths = derived([visibleMonths], ([$visibleMonths]) => {
		return (date: DateValue) => {
			return !$visibleMonths.some((month) => isSameMonth(date, month));
		};
	});

	const isNextButtonDisabled = withGet.derived(
		[months, maxValue, disabled],
		([$months, $maxValue, $disabled]) => {
			if (!$maxValue || !$months.length) return false;
			if ($disabled) return true;
			const lastMonthInView = $months[$months.length - 1].value;
			const firstMonthOfNextPage = lastMonthInView.add({ months: 1 }).set({ day: 1 });
			return isAfter(firstMonthOfNextPage, $maxValue);
		}
	);

	const isPrevButtonDisabled = withGet.derived(
		[months, minValue, disabled],
		([$months, $minValue, $disabled]) => {
			if (!$minValue || !$months.length) return false;
			if ($disabled) return true;
			const firstMonthInView = $months[0].value;
			const lastMonthOfPrevPage = firstMonthInView.subtract({ months: 1 }).set({ day: 35 });
			return isBefore(lastMonthOfPrevPage, $minValue);
		}
	);

	/**
	 * A derived store function that determines if a date is disabled based
	 * on the `isDateDisabled` prop, `minValue`, and `maxValue` props.
	 */
	const isDateDisabled = withGet.derived(
		[options.isDateDisabled, minValue, maxValue, disabled],
		([$isDateDisabled, $minValue, $maxValue, $disabled]) => {
			return (date: DateValue) => {
				if ($isDateDisabled?.(date) || $disabled) return true;
				if ($minValue && isBefore(date, $minValue)) return true;
				if ($maxValue && isBefore($maxValue, date)) return true;
				return false;
			};
		}
	);

	const isDateSelected = derived([value], ([$value]) => {
		return (date: DateValue) => {
			if (Array.isArray($value)) {
				return $value.some((d) => isSameDay(d, date));
			} else if (!$value) {
				return false;
			} else {
				return isSameDay($value, date);
			}
		};
	});

	/**
	 * A derived helper store that evaluates to true if a currently selected date is invalid.
	 */
	const isInvalid = derived(
		[value, isDateDisabled, options.isDateUnavailable],
		([$value, $isDateDisabled, $isDateUnavailable]) => {
			if (Array.isArray($value)) {
				if (!$value.length) return false;
				for (const date of $value) {
					if ($isDateDisabled?.(date)) return true;
					if ($isDateUnavailable?.(date)) return true;
				}
			} else {
				if (!$value) return false;
				if ($isDateDisabled?.($value)) return true;
				if ($isDateUnavailable?.($value)) return true;
			}
			return false;
		}
	);

	/**
	 * Initialize the announcer, which currently remains inactive in this context since it will
	 * be server-side rendered, but we'll initialize it in the calendar's action.
	 *
	 * The announcer is in charge of providing `aria-live` announcements for the calendar,
	 * such as when a date is selected.
	 */
	let announcer = getAnnouncer();

	/**
	 * The current heading value for the calendar, meant to be utilized with
	 * the {@link heading} builder.
	 * It renders the current displayed month and year, formatted for the current locale.
	 * This value updates automatically as the user navigates the calendar, even when
	 * displaying multiple months using the `numberOfMonths` prop.
	 */
	const headingValue = withGet.derived([months, locale], ([$months, $locale]) => {
		if (!$months.length) return '';
		if ($locale !== formatter.getLocale()) {
			formatter.setLocale($locale);
		}
		if ($months.length === 1) {
			const month = $months[0].value;
			return `${formatter.fullMonthAndYear(toDate(month))}`;
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

	/**
	 * The accessible heading label for the calendar, generated by combining the `calendarLabel`
	 * prop and the `headingValue` store to create a label like `Event Date, January 2021`.
	 */
	const fullCalendarLabel = withGet.derived(
		[headingValue, calendarLabel],
		([$headingValue, $calendarLabel]) => {
			return `${$calendarLabel}, ${$headingValue}`;
		}
	);

	/**
	 * The root element of the calendar, capable of housing multiple grids/months
	 * when using paged navigation.
	 */
	const calendar = makeElement(name(), {
		stores: [fullCalendarLabel, isInvalid, disabled, readonly, ids.calendar],
		returned: ([$fullCalendarLabel, $isInvalid, $disabled, $readonly, $calendarId]) => {
			return {
				id: $calendarId,
				role: 'application',
				'aria-label': $fullCalendarLabel,
				'data-invalid': $isInvalid ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
				'data-readonly': $readonly ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<CalendarEvents['calendar']> => {
			/**
			 * Generates the accessible calendar heading when the grid is mounted.
			 * The label is dynamically updated through an effect whenever there
			 * are changes in the active date or label.
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

	/**
	 * The calendar heading, visually displaying the current month and year. This heading
	 * is hidden from screen readers as an accessible heading is automatically generated
	 * for the calendar.
	 *
	 * To customize the accessible heading's prefix, use the `calendarLabel` prop. By default,
	 * the accessible heading reads as `Event Date, January 2021` for January 2021. If you set
	 * the `calendarLabel` prop to 'Booking Date', the accessible heading will be 'Booking Date,
	 * January 2021' for the same month and year.
	 */
	const heading = makeElement(name('heading'), {
		stores: [disabled],
		returned: ([$disabled]) => {
			return {
				'aria-hidden': true,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
	});

	/**
	 * A grid element that serves as a container for a single month in the calendar.
	 * Grids should be rendered for each month present in the `months` store returned
	 * by the `createCalendar` builder.
	 *
	 * For more details about the structure of the month object, refer to {@link Month}.
	 */
	const grid = makeElement(name('grid'), {
		stores: [readonly, disabled],
		returned: ([$readonly, $disabled]) => {
			return {
				tabindex: -1,
				role: 'grid',
				'aria-readonly': $readonly ? ('true' as const) : undefined,
				'aria-disabled': $disabled ? ('true' as const) : undefined,
				'data-readonly': $readonly ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
	});

	/**
	 * The 'prev' button for the calendar, enabling navigation to the
	 * previous page. In paged navigation mode, it moves the calendar
	 * back by the number of months specified in the `numberOfMonths` prop.
	 * In non-paged mode, it shifts the calendar back by one month.
	 */
	const prevButton = makeElement(name('prevButton'), {
		stores: [isPrevButtonDisabled],
		returned: ([$isPrevButtonDisabled]) => {
			const disabled = $isPrevButtonDisabled;
			return {
				role: 'button',
				type: 'button' as const,
				'aria-label': 'Previous',
				'aria-disabled': disabled ? ('true' as const) : undefined,
				'data-disabled': disabled ? '' : undefined,
				disabled: disabled ? true : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<CalendarEvents['prevButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					if (isPrevButtonDisabled.get()) return;
					prevPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	/**
	 * A button element designed for navigating to the next page of the calendar.
	 * If using paged navigation, it advances the calendar by the number of months
	 * specified in the `numberOfMonths` prop. If not using paged navigation, it
	 * moves the calendar forward by one month.
	 */
	const nextButton = makeElement(name('nextButton'), {
		stores: [isNextButtonDisabled],
		returned: ([$isNextButtonDisabled]) => {
			const disabled = $isNextButtonDisabled;
			return {
				role: 'button',
				type: 'button' as const,
				'aria-label': 'Next',
				'aria-disabled': disabled ? ('true' as const) : undefined,
				'data-disabled': disabled ? '' : undefined,
				disabled: disabled ? true : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<CalendarEvents['nextButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					if (isNextButtonDisabled.get()) return;
					nextPage();
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	/**
	 * Represents an individual date cell in the calendar grid,
	 * signifying a single day within the month. Configured with
	 * essential attributes and event handlers for accessibility
	 * and interactivity.
	 */
	const cell = makeElement(name('cell'), {
		stores: [
			isDateSelected,
			isDateDisabled,
			isDateUnavailable,
			isOutsideVisibleMonths,
			placeholder,
		],
		returned: ([
			$isDateSelected,
			$isDateDisabled,
			$isDateUnavailable,
			$isOutsideVisibleMonths,
			$placeholder,
		]) => {
			/**
			 * Applies the appropriate attributes to each date cell in the calendar.
			 *
			 * @params cellValue - The `DateValue` for the current cell.
			 * @params monthValue - The `DateValue` for the current month, which is used
			 * to determine if the current cell is outside the current month.
			 */
			return (cellValue: DateValue, monthValue: DateValue) => {
				const cellDate = toDate(cellValue);
				const isDisabled = $isDateDisabled?.(cellValue);
				const isUnavailable = $isDateUnavailable?.(cellValue);
				const isDateToday = isToday(cellValue, getLocalTimeZone());
				const isOutsideMonth = !isSameMonth(cellValue, monthValue);
				const isOutsideVisibleMonths = $isOutsideVisibleMonths(cellValue);
				const isFocusedDate = isSameDay(cellValue, $placeholder);
				const isSelectedDate = $isDateSelected(cellValue);

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
					'data-today': isDateToday ? '' : undefined,
					'data-outside-month': isOutsideMonth ? '' : undefined,
					'data-outside-visible-months': isOutsideVisibleMonths ? '' : undefined,
					'data-focused': isFocusedDate ? '' : undefined,
					tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? undefined : -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<CalendarEvents['cell']> => {
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
					handleCellClick(parseStringToDateValue(args.value, placeholder.get()));
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	/**
	 * Synchronize the locale used within the formatter to ensure
	 * dynamic updates are reflected in the calendar.
	 */
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

	/**
	 * Synchronizing the placeholder value with the current value.
	 */
	effect([value], ([$value]) => {
		if (Array.isArray($value) && $value.length) {
			const lastValue = $value[$value.length - 1];
			if (lastValue && placeholder.get() !== lastValue) {
				placeholder.set(lastValue);
			}
		} else if (!Array.isArray($value) && $value && placeholder.get() !== $value) {
			placeholder.set($value);
		}
	});

	/**
	 * This derived store holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this store to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 *
	 * @example
	 * ```svelte
	 * <table use:melt={$grid} class="w-full">
	 * 	<thead aria-hidden="true">
	 * 		<tr>
	 * 			{#each $weekdays as day}
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
	 * @example
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
	const weekdays = derived([months, weekdayFormat, locale], ([$months, $weekdayFormat, _]) => {
		if (!$months.length) return [];
		return $months[0].weeks[0].map((date) => {
			return formatter.dayOfWeek(toDate(date), $weekdayFormat);
		});
	});

	/**
	 * Creates an accessible heading for the calendar, ensuring that
	 * when it is focused by a screen reader, the displayed date range
	 * is announced. This approach maintains accessibility for screen
	 * readers while keeping the heading hidden from the visual design
	 * of the calendar.
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
	 * Navigate to the next year in the calendar.
	 *
	 * @remarks
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
		placeholder.add({ years: 1 });
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
		placeholder.subtract({ years: 1 });
	}

	const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];

	/**
	 * Set the year of the calendar to the specified year.
	 *
	 * @remarks
	 * This is useful if you want to extend the calendar to have
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
		placeholder.setDate({ year: year });
	}

	/**
	 * Set the month of the calendar to the specified month.
	 *
	 * @remarks
	 * This is useful if you want to extend the calendar to have
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
		placeholder.setDate({ month: month });
	}

	function handleCellClick(date: DateValue) {
		const $readonly = readonly.get();
		if ($readonly) return;
		const $isDateDisabled = isDateDisabled.get();
		const $isUnavailable = options.isDateUnavailable.get();
		if ($isDateDisabled?.(date) || $isUnavailable?.(date)) return;

		value.update((prev) => {
			const $multiple = multiple.get();
			if ($multiple) {
				return handleMultipleUpdate(prev, date) as Value[];
			} else {
				const next = handleSingleUpdate(prev, date);
				if (!next) {
					announcer.announce('Selected date is now empty.', 'polite', 5000);
				} else {
					announcer.announce(`Selected Date: ${formatter.selectedDate(next[0], false)}`, 'polite');
				}
				return next as Value[];
			}
		});
	}

	function handleSingleUpdate(prev: Value[] | undefined, date: DateValue) {
		if (!prev) return [date];
		const $preventDeselect = preventDeselect.get();
		if (!$preventDeselect && isSameDay(prev[0], date)) {
			placeholder.set(date);
			return undefined;
		}
		return [date];
	}

	function handleMultipleUpdate(prev: Value[] | undefined, date: DateValue) {
		if (!prev) return [date];
		const index = prev.findIndex((d) => isSameDay(d, date));
		const $preventDeselect = preventDeselect.get();

		if (index === -1) {
			return [...prev, date];
		} else if ($preventDeselect) {
			return prev;
		} else {
			const next = prev.filter((d) => !isSameDay(d, date));
			if (!next.length) {
				placeholder.set(date);
				return undefined;
			}
			return next;
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

			handleCellClick(parseStringToDateValue(cellValue, placeholder.get()));
		}
	}

	function shiftFocus(node: HTMLElement, add: number) {
		const candidateCells = getSelectableCells(ids.calendar.get());
		if (!candidateCells.length) return;

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
		 * When the next cell falls outside the displayed/rendered cells range,
		 * we update the focus to the previous or next month based on the direction,
		 * and then focus on the relevant cell.
		 */

		if (nextIndex < 0) {
			/**
			 * To handle negative index values, we rewind by one month,
			 * retrieve candidate cells for that month, and shift the focus
			 * by the difference between the nextIndex starting from the end
			 * of the array.
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
				const newCandidateCells = getSelectableCells(ids.calendar.get());
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * Starting at the end of the array, shift focus by the
				 * difference between the nextIndex and the length of the
				 * array, since the nextIndex is negative.
				 */

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
				const newCandidateCells = getSelectableCells(ids.calendar.get());
				if (!newCandidateCells.length) {
					return;
				}

				/**
				 * We need to determine how far into the next month we need to go
				 * to get the next index. So if we only went over the previous
				 * month by 1, we need to go into the next month by 1 to get the
				 * right index.
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
	 * A helper function to determine if a date cell is disabled,
	 * which uses the `Matcher`(s) provided via the `isDisabled`
	 * prop, as well as other internal logic, such as if it's
	 * outside of the month, or if it's before/after the min/max
	 * values.
	 *
	 * Although we set attributes on the cells themselves, for
	 * easy styling this function is useful when you want to
	 * conditionally handle something outside of the cell,
	 * such as its wrapping element.
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
		[isDateDisabled, placeholder, minValue, maxValue, disabled],
		([$isDateDisabled, $placeholder, $minValue, $maxValue, $disabled]) => {
			return (date: DateValue) => {
				if ($isDateDisabled?.(date) || $disabled) return true;
				if ($minValue && isBefore(date, $minValue)) return true;
				if ($maxValue && isAfter(date, $maxValue)) return true;
				if (!isSameMonth(date, $placeholder)) return true;
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
	 * 	<td role="gridcell">
	 * 		{#if $isUnavailable(date)}
	 * 			<span>X</span>
	 * 		{/if}
	 * 		<!-- ... -->
	 * 	</td>
	 * {/each}
	 * ```
	 *
	 * @param date - The `DateValue` to check
	 * @returns `true` if the date is disabled, `false` otherwise
	 */
	const _isDateUnavailable = derived(isDateUnavailable, ($isDateUnavailable) => {
		return (date: DateValue) => $isDateUnavailable?.(date);
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
			value,
			weekdays,
			headingValue,
		},
		helpers: {
			nextPage,
			prevPage,
			nextYear,
			prevYear,
			setYear,
			setMonth,
			isDateDisabled: _isDateDisabled,
			isDateSelected,
			isDateUnavailable: _isDateUnavailable,
		},
		options,
		ids,
	};
}
