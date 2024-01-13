import type { CreateDateFieldProps } from './types.js';
import {
	builder,
	createElHelpers,
	effect,
	kbd,
	overridable,
	toWritableStores,
	omit,
	isHTMLElement,
	addMeltEventListener,
	executeCallbacks,
	isNumberString,
	styleToString,
	noop,
	sleep,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDaysInMonth,
	getDefaultDate,
	toDate,
	createFormatter,
	getAnnouncer,
	isBefore,
	getFirstSegment,
} from '$lib/internal/helpers/date/index.js';
import { derived, get, writable, type Updater } from 'svelte/store';
import {
	isFirstSegment,
	areAllSegmentsFilled,
	createContent,
	getValueFromSegments,
	initSegmentStates,
	initializeSegmentValues,
	isDateAndTimeSegmentObj,
	isDateSegmentPart,
	getPartFromNode,
	isAcceptableSegmentKey,
	removeDescriptionElement,
	syncSegmentValues,
	setDescription,
	inferGranularity,
} from './_internal/helpers.js';
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextSegment,
} from '$lib/internal/helpers/date/index.js';
import type {
	AnyExceptLiteral,
	SegmentPart,
	DateAndTimeSegmentObj,
	DateSegmentObj,
	DateSegmentPart,
	DayPeriod,
	SegmentAttrProps,
	SegmentBuilders,
	TimeSegmentObj,
	TimeSegmentPart,
} from './_internal/types.js';
import type { DateValue } from '@internationalized/date';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { DateFieldEvents } from './events.js';
import { generateIds } from '../../internal/helpers/id.js';

const defaults = {
	isDateUnavailable: undefined,
	value: undefined,
	hourCycle: undefined,
	locale: 'en',
	granularity: undefined,
	hideTimeZone: false,
	disabled: false,
	readonly: false,
	readonlySegments: undefined,
	name: undefined,
	required: false,
	minValue: undefined,
	maxValue: undefined,
} satisfies CreateDateFieldProps;

type DateFieldParts = 'segment' | 'label' | 'hidden-input' | 'field' | 'validation';

const { name } = createElHelpers<DateFieldParts>('dateField');

const dateFieldIdParts = [
	'field',
	'label',
	'description',
	'validation',
	'day',
	'month',
	'year',
	'hour',
	'minute',
	'second',
	'dayPeriod',
	'timeZoneName',
] as const;
export type DateFieldIdParts = typeof dateFieldIdParts;

export function createDateField(props?: CreateDateFieldProps) {
	const withDefaults = { ...defaults, ...props };

	const options = toWritableStores(omit(withDefaults, 'value', 'placeholder', 'ids'));
	const {
		locale,
		granularity,
		hourCycle,
		hideTimeZone,
		isDateUnavailable,
		disabled,
		readonly,
		readonlySegments,
		name: nameStore,
		required,
		minValue,
		maxValue,
	} = options;

	const defaultDate = getDefaultDate({
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		granularity: withDefaults.granularity,
		defaultValue: withDefaults.defaultValue,
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const isInvalid = derived(
		[value, isDateUnavailable, minValue, maxValue],
		([$value, $isDateUnavailable, $minValue, $maxValue]) => {
			if (!$value) return false;
			if ($isDateUnavailable?.($value)) return true;
			if ($minValue && isBefore($value, $minValue)) return true;
			if ($maxValue && isBefore($maxValue, $value)) return true;
			return false;
		}
	);

	const placeholderWritable =
		withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
	const placeholder = dateStore(
		overridable(placeholderWritable, withDefaults.onPlaceholderChange),
		withDefaults.defaultPlaceholder ?? defaultDate
	);

	const inferredGranularity = derived(
		[placeholder, granularity],
		([$placeholder, $granularity]) => {
			if ($granularity) {
				return $granularity;
			} else {
				return inferGranularity($placeholder, $granularity);
			}
		}
	);

	const formatter = createFormatter(get(locale));
	const initialSegments = initializeSegmentValues(get(inferredGranularity));
	const segmentValues = writable(structuredClone(initialSegments));

	let announcer = getAnnouncer();

	/**
	 * Prevent a condition where the value of the date
	 * overrides the updated dayPeriod value when all
	 * segments are filled.
	 */
	const updatingDayPeriod = writable<DayPeriod>(null);

	const readonlySegmentsSet = derived(
		readonlySegments,
		($readonlySegments) => new Set<SegmentPart>($readonlySegments)
	);

	const ids = toWritableStores({ ...generateIds(dateFieldIdParts), ...withDefaults.ids });

	const idValues = derived(
		[
			ids.field,
			ids.label,
			ids.description,
			ids.validation,
			ids.day,
			ids.month,
			ids.year,
			ids.hour,
			ids.minute,
			ids.second,
			ids.dayPeriod,
			ids.timeZoneName,
		],
		([
			$fieldId,
			$labelId,
			$descriptionId,
			$validationId,
			$dayId,
			$monthId,
			$yearId,
			$hourId,
			$minuteId,
			$secondId,
			$dayPeriodId,
			$timeZoneNameId,
		]) => {
			return {
				field: $fieldId,
				label: $labelId,
				description: $descriptionId,
				validation: $validationId,
				day: $dayId,
				month: $monthId,
				year: $yearId,
				hour: $hourId,
				minute: $minuteId,
				second: $secondId,
				dayPeriod: $dayPeriodId,
				timeZoneName: $timeZoneNameId,
			};
		}
	);

	/**
	 * The default attributes applied to the segments
	 * that are interactive.
	 */
	const defaultSegmentAttrs = {
		role: 'spinbutton',
		contenteditable: true,
		tabindex: 0,
		spellcheck: false,
		inputmode: 'numeric',
		autocorrect: 'off',
		enterkeyhint: 'next',
		style: styleToString({
			'caret-color': 'transparent',
		}),
	};

	const states = initSegmentStates();

	const allSegmentContent = derived(
		[segmentValues, locale, inferredGranularity, hideTimeZone, hourCycle],
		([$segmentValues, $locale, $inferredGranularity, $hideTimeZone, $hourCycle]) => {
			return createContent({
				segmentValues: $segmentValues,
				formatter,
				locale: $locale,
				granularity: $inferredGranularity,
				dateRef: get(placeholder),
				hideTimeZone: $hideTimeZone,
				hourCycle: $hourCycle,
			});
		}
	);

	const segmentContents = derived(
		allSegmentContent,
		($allSegmentContent) => $allSegmentContent.arr
	);

	const segmentContentsObj = derived(
		allSegmentContent,
		($allSegmentContent) => $allSegmentContent.obj
	);

	const label = builder(name('label'), {
		stores: [isInvalid, disabled, ids.label],
		returned: ([$isInvalid, $disabled, $labelId]) => {
			return {
				id: $labelId,
				'data-invalid': $isInvalid ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const firstSegment = getFirstSegment(get(ids.field));
					if (!firstSegment) return;
					sleep(1).then(() => firstSegment.focus());
				}),
				addMeltEventListener(node, 'mousedown', (e) => {
					if (!e.defaultPrevented && e.detail > 1) {
						e.preventDefault();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const validation = builder(name('validation'), {
		stores: [isInvalid, ids.validation],
		returned: ([$isInvalid, $validationId]) => {
			const validStyle = styleToString({
				display: 'none',
			});

			return {
				id: $validationId,
				'data-invalid': $isInvalid ? '' : undefined,
				style: $isInvalid ? undefined : validStyle,
			};
		},
	});

	const hiddenInput = builder(name('hidden-input'), {
		stores: [value, nameStore, disabled, required],
		returned: ([$value, $nameStore, $disabled, $required]) => {
			return {
				name: $nameStore,
				value: $value?.toString(),
				'aria-hidden': 'true' as const,
				hidden: true,
				disabled: $disabled,
				required: $required,
				tabIndex: -1,
				style: styleToString({
					position: 'absolute',
					opacity: 0,
					'pointer-events': 'none',
					margin: 0,
					transform: 'translateX(-100%)',
				}),
			};
		},
	});

	const fieldIdDeps = derived(
		[ids.field, ids.label, ids.description, ids.label],
		([$fieldId, $labelId, $descriptionId, $validationId]) => {
			return {
				field: $fieldId,
				label: $labelId,
				description: $descriptionId,
				validation: $validationId,
			};
		}
	);

	/**
	 * The date field element which contains all the segments.
	 */
	const field = builder(name('field'), {
		stores: [value, isInvalid, disabled, readonly, fieldIdDeps],
		returned: ([$value, $isInvalid, $disabled, $readonly, $ids]) => {
			const describedBy = $value
				? `${$ids.description}${$isInvalid ? ` ${$ids.validation}` : ''}`
				: `${$ids.description}`;

			return {
				role: 'group',
				id: $ids.field,
				'aria-labelledby': $ids.label,
				'aria-describedby': describedBy,
				'aria-disabled': $disabled ? ('true' as const) : undefined,
				'aria-readonly': $readonly ? ('true' as const) : undefined,
				'data-invalid': $isInvalid ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
		// even if we don't need the element we need to specify it
		// or TS will complain when svelte tries to pass it
		action: (_node: HTMLElement) => {
			/**
			 * Initialize the announcer here, where
			 * we know we have access to the DOM.
			 */
			announcer = getAnnouncer();

			return {
				destroy() {
					removeDescriptionElement(get(ids.description));
				},
			};
		},
	});

	const segmentBuilders: SegmentBuilders = {
		day: {
			attrs: daySegmentAttrs,
			action: daySegmentAction,
		},
		month: {
			attrs: monthSegmentAttrs,
			action: monthSegmentAction,
		},
		year: {
			attrs: yearSegmentAttrs,
			action: yearSegmentAction,
		},
		hour: {
			attrs: hourSegmentAttrs,
			action: hourSegmentAction,
		},
		minute: {
			attrs: minuteSegmentAttrs,
			action: minuteSegmentAction,
		},
		second: {
			attrs: secondSegmentAttrs,
			action: secondSegmentAction,
		},
		dayPeriod: {
			attrs: dayPeriodSegmentAttrs,
			action: dayPeriodSegmentAction,
		},
		literal: {
			attrs: literalSegmentAttrs,
			action: literalSegmentAction,
		},
		timeZoneName: {
			attrs: timeZoneSegmentAttrs,
			action: timeZoneSegmentAction,
		},
	};

	const segment = builder(name('segment'), {
		stores: [
			segmentValues,
			hourCycle,
			placeholder,
			value,
			isInvalid,
			disabled,
			readonly,
			readonlySegmentsSet,
			idValues,
			locale,
		],
		returned: ([
			$segmentValues,
			$hourCycle,
			$placeholder,
			$value,
			$isInvalid,
			$disabled,
			$readonly,
			$readonlySegmentsSet,
			$idValues,
			_,
		]) => {
			const props = {
				segmentValues: $segmentValues,
				hourCycle: $hourCycle,
				placeholder: $placeholder,
				ids: $idValues,
			};
			return (part: SegmentPart) => {
				const inReadonlySegments = $readonlySegmentsSet.has(part);
				const defaultAttrs = {
					...getSegmentAttrs(part, props),
					'aria-invalid': $isInvalid ? ('true' as const) : undefined,
					'aria-disabled': $disabled ? ('true' as const) : undefined,
					'aria-readonly': $readonly || inReadonlySegments ? ('true' as const) : undefined,
					'data-invalid': $isInvalid ? '' : undefined,
					'data-disabled': $disabled ? '' : undefined,
					'data-segment': `${part}`,
				};
				if (part === 'literal') {
					return defaultAttrs;
				}
				const id = $idValues[part];
				const hasDescription = isFirstSegment(id, $idValues.field) || $value;
				const describedBy = hasDescription
					? `${hasDescription} ${$isInvalid ? $idValues.validation : ''}`
					: undefined;

				return {
					...defaultAttrs,
					id: $idValues[part],
					'aria-labelledby': getLabelledBy(part),
					contenteditable: $readonly || inReadonlySegments || $disabled ? false : true,
					'aria-describedby': describedBy,
					tabindex: $disabled ? undefined : 0,
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<DateFieldEvents['segment']> =>
			getSegmentAction(node),
	});

	function updateSegment<T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
			? Updater<TimeSegmentObj[T]>
			: Updater<DateAndTimeSegmentObj[T]>
	) {
		if (get(disabled) || get(readonly) || get(readonlySegmentsSet).has(part)) return;
		segmentValues.update((prev) => {
			const dateRef = get(placeholder);
			if (isDateAndTimeSegmentObj(prev)) {
				const pVal = prev[part];
				const castCb = cb as Updater<DateAndTimeSegmentObj[T]>;
				if (part === 'month') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['month'];
					if (part === 'month' && next !== null && prev.day !== null) {
						const date = dateRef.set({ month: next });
						const daysInMonth = getDaysInMonth(toDate(date));
						if (prev.day > daysInMonth) {
							prev.day = daysInMonth;
						}
					}
					return {
						...prev,
						[part]: next,
					};
				} else if (part === 'dayPeriod') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['dayPeriod'];
					updatingDayPeriod.set(next);
					const date = get(placeholder);
					if ('hour' in date) {
						const trueHour = date.hour;
						if (next === 'AM') {
							if (trueHour >= 12) {
								prev.hour = trueHour - 12;
							}
						} else if (next === 'PM') {
							if (trueHour < 12) {
								prev.hour = trueHour + 12;
							}
						}
					}

					return {
						...prev,
						[part]: next,
					};
				} else if (part === 'hour') {
					const next = castCb(pVal) as DateAndTimeSegmentObj['hour'];
					if (next !== null && prev.dayPeriod !== null) {
						const dayPeriod = formatter.dayPeriod(toDate(dateRef.set({ hour: next })));
						if (dayPeriod === 'AM' || dayPeriod === 'PM') {
							prev.dayPeriod = dayPeriod;
						}
					}
					return {
						...prev,
						[part]: next,
					};
				}

				const next = castCb(pVal);
				return {
					...prev,
					[part]: next,
				};
			} else if (isDateSegmentPart(part)) {
				const pVal = prev[part];
				const castCb = cb as Updater<DateSegmentObj[DateSegmentPart]>;
				const next = castCb(pVal);
				if (part === 'month' && next !== null && prev.day !== null) {
					const date = dateRef.set({ month: next });
					const daysInMonth = getDaysInMonth(toDate(date));
					if (prev.day > daysInMonth) {
						prev.day = daysInMonth;
					}
				}
				return {
					...prev,
					[part]: next,
				};
			}

			return prev;
		});
		const $segmentValues = get(segmentValues);
		const $fieldId = get(ids.field);
		if (areAllSegmentsFilled($segmentValues, $fieldId)) {
			value.set(
				getValueFromSegments({
					segmentObj: $segmentValues,
					id: $fieldId,
					dateRef: get(placeholder),
				})
			);
			updatingDayPeriod.set(null);
		} else {
			value.set(undefined);
			segmentValues.set($segmentValues);
		}
	}

	/**
	 * Maps the segment part to its corresponding handler function.
	 * We're using a map here to avoid a switch statement, yet
	 * still have the ability to share common logic between all
	 * the handlers.
	 */
	function handleSegmentKeydown(e: KeyboardEvent, part: AnyExceptLiteral) {
		const $disabled = get(disabled);
		if (e.key !== kbd.TAB) {
			e.preventDefault();
		}
		if ($disabled) return;
		const segmentKeydownHandlers = {
			day: handleDaySegmentKeydown,
			month: handleMonthSegmentKeydown,
			year: handleYearSegmentKeydown,
			hour: handleHourSegmentKeydown,
			minute: handleMinuteSegmentKeydown,
			second: handleSecondSegmentKeydown,
			dayPeriod: handleDayPeriodSegmentKeydown,
			timeZoneName: handleTimeZoneSegmentKeydown,
		} as const;

		segmentKeydownHandlers[part](e);
	}

	/**
	 * Handles 'click' events on the segments,
	 * which prevents the default behavior of
	 * focusing the segment if the field is disabled.
	 */
	function handleSegmentClick(e: MouseEvent) {
		const $disabled = get(disabled);
		if ($disabled) {
			e.preventDefault();
			return;
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * DAY SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function daySegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, placeholder, ids } = props;
		const isEmpty = segmentValues.day === null;
		const date = segmentValues.day ? placeholder.set({ day: segmentValues.day }) : placeholder;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(toDate(date));
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...defaultSegmentAttrs,
			id: ids.day,
			'aria-label': `day,`,
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function daySegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'day')),
			addMeltEventListener(node, 'focusout', () => (states.day.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleDaySegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		const $segmentMonthValue = get(segmentValues).month;
		const $placeholder = get(placeholder);

		const daysInMonth = $segmentMonthValue
			? getDaysInMonth($placeholder.set({ month: $segmentMonthValue }))
			: getDaysInMonth($placeholder);

		if (e.key === kbd.ARROW_UP) {
			updateSegment('day', (prev) => {
				if (prev === null) {
					const next = $placeholder.day;
					announcer.announce(next);
					return next;
				}
				const next = $placeholder.set({ day: prev }).cycle('day', 1).day;
				announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('day', (prev) => {
				if (prev === null) {
					const next = $placeholder.day;
					announcer.announce(next);
					return next;
				}
				const next = $placeholder.set({ day: prev }).cycle('day', -1).day;
				announcer.announce(next);
				return next;
			});
			return;
		}

		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('day', (prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.day.hasLeftFocus) {
					prev = null;
					states.day.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.day.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.day.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					states.day.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */

				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart || total > max) {
						moveToNext = true;
					}
					announcer.announce(num);
					return num;
				}
				moveToNext = true;
				announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			const currentTarget = e.currentTarget;
			if (!isHTMLElement(currentTarget)) return;

			updateSegment('day', (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * MONTH SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function monthSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, placeholder, ids } = props;
		const isEmpty = segmentValues.month === null;
		const date = segmentValues.month
			? placeholder.set({ month: segmentValues.month })
			: placeholder;
		const valueNow = date.month;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty ? 'Empty' : `${valueNow} - ${formatter.fullMonth(toDate(date))}`;

		return {
			...defaultSegmentAttrs,
			id: ids.month,
			'aria-label': 'month, ',
			contenteditable: true,
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function monthSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'month')),
			addMeltEventListener(node, 'focusout', () => (states.month.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleMonthSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		const $placeholder = get(placeholder);
		function getMonthAnnouncement(month: number) {
			return `${month} - ${formatter.fullMonth(toDate($placeholder.set({ month })))}`;
		}

		const max = 12;

		states.month.hasTouched = true;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('month', (prev) => {
				if (prev === null) {
					const next = $placeholder.month;
					announcer.announce(getMonthAnnouncement(next));
					return next;
				}
				const next = $placeholder.set({ month: prev }).cycle('month', 1);
				announcer.announce(getMonthAnnouncement(next.month));
				return next.month;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('month', (prev) => {
				if (prev === null) {
					const next = $placeholder.month;
					announcer.announce(getMonthAnnouncement(next));
					return next;
				}
				const next = $placeholder.set({ month: prev }).cycle('month', -1).month;
				announcer.announce(getMonthAnnouncement(next));
				return next;
			});
			return;
		}
		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('month', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.month.hasLeftFocus) {
					prev = null;
					states.month.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.month.lastKeyZero = true;
						announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (1), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.month.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					states.month.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					announcer.announce(num);
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					announcer.announce(num);
					return num;
				}
				moveToNext = true;
				announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.month.hasLeftFocus = false;
			updateSegment('month', (prev) => {
				if (prev === null) {
					announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				announcer.announce(getMonthAnnouncement(next));
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * YEAR SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function yearSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, placeholder, ids } = props;
		const isEmpty = segmentValues.year === null;
		const date = segmentValues.year ? placeholder.set({ year: segmentValues.year }) : placeholder;
		const valueMin = 1;
		const valueMax = 9999;
		const valueNow = date.year;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...defaultSegmentAttrs,
			id: ids.year,
			'aria-label': 'year, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function yearSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'year')),
			addMeltEventListener(node, 'focusout', () => (states.year.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleYearSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.year.hasTouched = true;
		const $placeholder = get(placeholder);

		if (e.key === kbd.ARROW_UP) {
			updateSegment('year', (prev) => {
				if (prev === null) {
					const next = $placeholder.year;
					announcer.announce(next);
					return next;
				}
				const next = $placeholder.set({ year: prev }).cycle('year', 1).year;
				announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('year', (prev) => {
				if (prev === null) {
					const next = $placeholder.year;
					announcer.announce(next);
					return next;
				}
				const next = $placeholder.set({ year: prev }).cycle('year', -1).year;
				announcer.announce(next);
				return next;
			});
			return;
		}

		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			let moveToNext = false;
			const num = parseInt(e.key);
			updateSegment('year', (prev) => {
				if (states.year.hasLeftFocus) {
					prev = null;
					states.year.hasLeftFocus = false;
				}

				if (prev === null) {
					announcer.announce(num);
					return num;
				}
				const str = prev.toString() + num.toString();
				if (str.length > 4) {
					announcer.announce(num);
					return num;
				}
				if (str.length === 4) {
					moveToNext = true;
				}

				const int = parseInt(str);
				announcer.announce(int);
				return int;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			updateSegment('year', (prev) => {
				if (prev === null) {
					announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * HOUR SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function hourSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, hourCycle, placeholder, ids } = props;
		if (!('hour' in segmentValues) || !('hour' in placeholder)) return {};
		const isEmpty = segmentValues.hour === null;
		const date = segmentValues.hour ? placeholder.set({ hour: segmentValues.hour }) : placeholder;
		const valueMin = hourCycle === 12 ? 1 : 0;
		const valueMax = hourCycle === 12 ? 12 : 23;
		const valueNow = date.hour;
		const valueText = isEmpty ? 'Empty' : `${valueNow} ${segmentValues.dayPeriod ?? ''}`;

		return {
			...defaultSegmentAttrs,
			id: ids.hour,
			'aria-label': 'hour, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function hourSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'hour')),
			addMeltEventListener(node, 'focusout', () => (states.hour.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleHourSegmentKeydown(e: KeyboardEvent) {
		const dateRef = get(placeholder);
		if (!isAcceptableSegmentKey(e.key) || !('hour' in dateRef)) {
			return;
		}

		states.hour.hasTouched = true;

		const $hourCycle = get(hourCycle);

		if (e.key === kbd.ARROW_UP) {
			updateSegment('hour', (prev) => {
				if (prev === null) {
					const next = dateRef.cycle('hour', 1, { hourCycle: $hourCycle }).hour;
					announcer.announce(next);
					return next;
				}
				const next = dateRef.set({ hour: prev }).cycle('hour', 1, { hourCycle: $hourCycle }).hour;
				announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('hour', (prev) => {
				if (prev === null) {
					const next = dateRef.cycle('hour', -1, { hourCycle: $hourCycle }).hour;
					announcer.announce(next);
					return next;
				}
				const next = dateRef.set({ hour: prev }).cycle('hour', -1, { hourCycle: $hourCycle }).hour;
				announcer.announce(next);
				return next;
			});
			return;
		}

		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('hour', (prev) => {
				const maxStart = Math.floor(24 / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.hour.hasLeftFocus) {
					prev = null;
					states.hour.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.hour.lastKeyZero = true;
						announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.hour.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					states.hour.lastKeyZero = false;
					announcer.announce(num);
					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > 24) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					announcer.announce(num);
					return num;
				}
				moveToNext = true;
				announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.hour.hasLeftFocus = false;
			updateSegment('hour', (prev) => {
				if (prev === null) {
					announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * MINUTE SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function minuteSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, placeholder, ids } = props;
		if (!('minute' in segmentValues) || !('minute' in placeholder)) return {};
		const isEmpty = segmentValues.minute === null;
		const date = segmentValues.minute
			? placeholder.set({ minute: segmentValues.minute })
			: placeholder;
		const valueNow = date.minute;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...defaultSegmentAttrs,
			id: ids.minute,
			'aria-label': 'minute, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function minuteSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'minute')),
			addMeltEventListener(node, 'focusout', () => (states.minute.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleMinuteSegmentKeydown(e: KeyboardEvent) {
		const dateRef = get(placeholder);
		if (!isAcceptableSegmentKey(e.key) || !('minute' in dateRef)) {
			return;
		}

		states.minute.hasTouched = true;

		const min = 0;
		const max = 59;

		if (e.key === kbd.ARROW_UP) {
			updateSegment('minute', (prev) => {
				if (prev === null) {
					announcer.announce(min);
					return min;
				}
				const next = dateRef.set({ minute: prev }).cycle('minute', 1).minute;
				announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('minute', (prev) => {
				if (prev === null) {
					announcer.announce(max);
					return max;
				}
				const next = dateRef.set({ minute: prev }).cycle('minute', -1).minute;
				announcer.announce(next);
				return next;
			});
			return;
		}

		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('minute', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.minute.hasLeftFocus) {
					prev = null;
					states.minute.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.minute.lastKeyZero = true;
						announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.minute.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					states.minute.lastKeyZero = false;
					announcer.announce(num);
					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					announcer.announce(num);
					return num;
				}
				moveToNext = true;
				announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.minute.hasLeftFocus = false;
			updateSegment('minute', (prev) => {
				if (prev === null) {
					announcer.announce('Empty');
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					announcer.announce('Empty');
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * SECOND SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function secondSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, placeholder, ids } = props;
		if (!('second' in segmentValues) || !('second' in placeholder)) return {};
		const isEmpty = segmentValues.second === null;
		const date = segmentValues.second
			? placeholder.set({ second: segmentValues.second })
			: placeholder;
		const valueNow = date.second;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? 'Empty' : `${valueNow}`;

		return {
			...defaultSegmentAttrs,
			id: ids.second,
			'aria-label': 'second, ',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function secondSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'second')),
			addMeltEventListener(node, 'focusout', () => (states.second.hasLeftFocus = true)),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleSecondSegmentKeydown(e: KeyboardEvent) {
		const dateRef = get(placeholder);
		if (!isAcceptableSegmentKey(e.key)) {
			return;
		}

		states.second.hasTouched = true;

		const min = 0;
		const max = 59;

		if (!('second' in dateRef)) return;
		if (e.key === kbd.ARROW_UP) {
			updateSegment('second', (prev) => {
				if (prev === null) {
					announcer.announce(min);
					return min;
				}
				const next = dateRef.set({ second: prev }).cycle('second', 1).second;
				announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			updateSegment('second', (prev) => {
				if (prev === null) {
					announcer.announce(max);
					return max;
				}
				const next = dateRef.set({ second: prev }).cycle('second', -1).second;
				announcer.announce(next);
				return next;
			});
			return;
		}

		const $fieldId = get(ids.field);

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			updateSegment('second', (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.second.hasLeftFocus) {
					prev = null;
					states.second.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.second.lastKeyZero = true;
						announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (states.second.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					states.second.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					announcer.announce(num);
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					announcer.announce(num);
					return num;
				}
				moveToNext = true;
				announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, $fieldId);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			states.second.hasLeftFocus = false;
			updateSegment('second', (prev) => {
				if (prev === null) {
					announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, $fieldId);
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * DAY PERIOD SEGMENT
	 *
	 * -----------------------------------------------------
	 */

	function dayPeriodSegmentAttrs(props: SegmentAttrProps) {
		const { segmentValues, ids } = props;
		if (!('dayPeriod' in segmentValues)) return {};

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = segmentValues.dayPeriod ?? 0;
		const valueText = segmentValues.dayPeriod ?? 'AM';

		return {
			...defaultSegmentAttrs,
			inputmode: 'text',
			id: ids.dayPeriod,
			'aria-label': 'AM/PM',
			'aria-valuemin': valueMin,
			'aria-valuemax': valueMax,
			'aria-valuenow': valueNow,
			'aria-valuetext': valueText,
		};
	}

	function dayPeriodSegmentAction(node: HTMLElement) {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'dayPeriod')),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);

		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	/**
	 * The event handler responsible for handling keydown events
	 * on the minute segment.
	 */
	function handleDayPeriodSegmentKeydown(e: KeyboardEvent) {
		if (!isAcceptableSegmentKey(e.key) && e.key !== kbd.A && e.key !== kbd.P) {
			return;
		}

		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
			updateSegment('dayPeriod', (prev) => {
				if (prev === 'AM') {
					const next = 'PM';
					announcer.announce(next);
					return next;
				}
				const next = 'AM';
				announcer.announce(next);
				return next;
			});
			return;
		}

		if (e.key === kbd.BACKSPACE) {
			states.second.hasLeftFocus = false;
			updateSegment('dayPeriod', () => {
				const next = 'AM';
				announcer.announce(next);
				return 'AM';
			});
		}

		if (e.key === 'a') {
			updateSegment('dayPeriod', () => {
				const next = 'AM';
				announcer.announce(next);
				return 'AM';
			});
		}
		if (e.key === 'p') {
			updateSegment('dayPeriod', () => {
				const next = 'PM';
				announcer.announce(next);
				return 'PM';
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, get(ids.field));
		}
	}

	/*
	 * -----------------------------------------------------
	 *
	 * LITERAL SEGMENT
	 *
	 * -----------------------------------------------------
	 */
	function literalSegmentAttrs(_: SegmentAttrProps) {
		return {
			'aria-hidden': true,
			'data-segment': 'literal',
		};
	}

	function literalSegmentAction(_: HTMLElement): MeltActionReturn<DateFieldEvents['segment']> {
		return {
			destroy: noop,
		};
	}

	/*
	 * -----------------------------------------------------
	 *
	 * TIMEZONE SEGMENT
	 *
	 * -----------------------------------------------------
	 */
	function timeZoneSegmentAttrs(_: SegmentAttrProps) {
		return {
			role: 'textbox',
			'aria-label': 'timezone, ',
			'data-readonly': true,
			'data-segment': 'timeZoneName',
			tabindex: 0,
			style: styleToString({
				'caret-color': 'transparent',
			}),
		};
	}

	function timeZoneSegmentAction(node: HTMLElement): MeltActionReturn<DateFieldEvents['segment']> {
		const unsubEvents = executeCallbacks(
			addMeltEventListener(node, 'keydown', (e) => handleSegmentKeydown(e, 'timeZoneName')),
			addMeltEventListener(node, 'click', handleSegmentClick)
		);
		return {
			destroy() {
				unsubEvents();
			},
		};
	}

	function handleTimeZoneSegmentKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, get(ids.field));
		}
	}

	function getSegmentAttrs(part: SegmentPart, props: SegmentAttrProps) {
		return segmentBuilders[part]?.attrs(props);
	}

	function getSegmentAction(node: HTMLElement): MeltActionReturn<DateFieldEvents['segment']> {
		const part = getPartFromNode(node);
		if (!part) {
			throw new Error('No segment part found');
		}
		return segmentBuilders[part].action(node) as MeltActionReturn<DateFieldEvents['segment']>;
	}

	/**
	 * Gets the `aria-labelledby` value for a given segment part.
	 */
	function getLabelledBy(part: AnyExceptLiteral) {
		return `${get(ids[part])} ${get(ids.label)}`;
	}

	/**
	 * Keeping the locale used in the formatter in sync
	 * with the locale option store.
	 */
	effect(locale, ($locale) => {
		if (formatter.getLocale() === $locale) return;
		formatter.setLocale($locale);
	});

	effect(value, ($value) => {
		if ($value) {
			// Set the description of the field for screen readers
			setDescription(get(ids.description), formatter, $value);
		}
		if ($value && get(placeholder) !== $value) {
			placeholder.set($value);
		}
	});

	effect([value, locale], ([$value, _]) => {
		// using `locale` as a dep so that we can reconvert
		// when using a different hour cycle
		if ($value) {
			syncSegmentValues({
				value: $value,
				segmentValues,
				formatter,
				updatingDayPeriod,
			});
		} else {
			segmentValues.set(structuredClone(initialSegments));
		}
	});

	const _isDateUnavailable = derived(isDateUnavailable, ($isDateUnavailable) => {
		return (date: DateValue) => $isDateUnavailable?.(date);
	});

	return {
		elements: {
			field,
			segment,
			label,
			hiddenInput,
			validation,
		},
		states: {
			value,
			segmentValues,
			segmentContents,
			segmentContentsObj,
			placeholder: placeholder.toWritable(),
			isInvalid,
		},
		helpers: {
			isDateUnavailable: _isDateUnavailable,
		},
		options,
		ids,
	};
}
