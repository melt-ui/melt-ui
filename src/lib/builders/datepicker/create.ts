import {
	SELECTION_KEYS,
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	getNextFocusable,
	getPreviousFocusable,
	handleRovingFocus,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	sleep,
	styleToString,
} from '$lib/internal/helpers';

import {
	isAfter,
	isBefore,
	isBetween,
	isSameDay,
	isToday,
	nextMonth as getNextMonth,
	nextYear as getNextYear,
	prevMonth as getPrevMonth,
	prevYear as getPrevYear,
	getLastSunday,
	getNextSaturday,
	getDaysBetween,
} from './utils';

import { usePopper } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { onMount, tick } from 'svelte';
import { derived, get, readable, writable } from 'svelte/store';
import type { CreateDatePickerArgs, DateArgs } from './types';
import { getOptions } from '@melt-ui/svelte/internal/helpers/list';

const defaults = {
	closeOnEscape: true,
	closeOnOutsideClick: true,
	disabled: false,
	earliest: null,
	latest: null,
	preventScroll: true,
	type: 'date',
	value: new Date(),
	open: false,
	arrowSize: 6,
	positioning: {
		placement: 'bottom',
	},
} satisfies Defaults<CreateDatePickerArgs>;

type CalendarParts =
	| 'trigger'
	| 'content'
	| 'nextMonth'
	| 'prevMonth'
	| 'nextYear'
	| 'prevYear'
	| 'dateGrid'
	| 'close'
	| 'confirm'
	| 'date';
const { name } = createElHelpers<CalendarParts>('calendar');

export function createDatePicker(args?: CreateDatePickerArgs) {
	const options = { ...defaults, ...args } as CreateDatePickerArgs;
	const positioning = readable(options.positioning);
	const arrowSize = readable(options.arrowSize);
	const open = writable(options.open);

	const activeTrigger = writable<HTMLElement | null>(null);

	const value = writable(options.value);

	const ids = {
		content: generateId(),
	};

	const dates = writable<Date[]>([]);
	const lastMonthDates = writable<Date[]>([]);
	const nextMonthDates = writable<Date[]>([]);
	const activeDate = writable<Date | null>(new Date());
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const nextMonth = builder(name('nextMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getNextMonth(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const prevMonth = builder(name('prevMonth'), {
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getPrevMonth(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const nextYear = builder(name('nextYear'), {
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getNextYear(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const prevYear = builder(name('prevYear'), {
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				activeDate.update((prev) => {
					return getPrevYear(prev ?? new Date());
				});
			});

			return {
				destroy() {
					unsub();
				},
			};
		},
		stores: [dates, activeDate],
		returned: (dates) => {
			return {};
		},
	});

	const content = builder(name('content'), {
		stores: open,
		returned: ($open) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.content,
			};
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[open, activeTrigger, positioning],
				([$open, $activeTrigger, $positioning]) => {
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: $positioning,
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				}
			);

			const unsubKb = addEventListener(node, 'keydown', (e) => {
				const triggerElement = e.currentTarget;
				if (!isHTMLElement(triggerElement)) return;
				console.log(e.key);

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
					unsubDerived();
					unsubPopper();
					unsubKb();
				},
			};
		},
	});

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.update((prev) => {
					const isOpen = !prev;
					if (isOpen) {
						activeTrigger.set(node);
					} else {
						activeTrigger.set(null);
					}
					return isOpen;
				});
			});

			return {
				destroy: unsub,
			};
		},
	});

	const arrow = derived(arrowSize, ($arrowSize) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$arrowSize}px)`,
			height: `var(--arrow-size, ${$arrowSize}px)`,
		}),
	}));

	const close = builder(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.set(false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const date = builder(name('date'), {
		stores: value,
		returned: ($value) => {
			const { earliest, latest } = options;
			return (args: DateArgs) => {
				console.log(args.value);
				return {
					role: 'option',
					'aria-selected': isSameDay($value, new Date(args.value)) ? true : undefined,
					'data-selected': $value === args?.value ? '' : undefined,
					'data-value': args.value,
					'data-label': args.label ?? undefined,
					'data-disabled': args.disabled ? '' : undefined,
					tabindex: args.disabled ? -1 : 1,
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
			const unsub = addEventListener(node, 'click', () => {
				const args = getElArgs();
				console.log(args);
				value.set(new Date(args.value || ''));
			});

			return {
				destroy: unsub,
			};
		},
	});

	function focusElement(add: number) {
		let node = document.activeElement as HTMLElement;
		console.log(node);
		if (!node || node.hasAttribute('[data-melt-calendar-date]')) return;
		const allDates = Array.from(
			document.querySelectorAll<HTMLElement>(`[data-melt-calendar-date]:not([disabled])`)
		);
		let index = allDates.indexOf(node);
		let nextIndex = index + add;
		let nextDate = allDates[nextIndex];
		if (nextDate) {
			nextDate.focus();
		}
	}

	onMount(() => {
		// TODO: add keyboard navigation
	});

	effect([open, activeTrigger, activeDate], ([$open, $activeTrigger, $activeDate]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}

		if ($activeDate) {
			const daysInMonth = new Date(
				$activeDate.getFullYear(),
				$activeDate.getMonth() + 1,
				0
			).getDate();

			const datesArray = Array(daysInMonth)
				.fill(0)
				.map((_, i) => new Date($activeDate.getFullYear(), $activeDate.getMonth(), i + 1));

			let lastSunday = getLastSunday(datesArray[0]);
			let nextSaturday = getNextSaturday(datesArray[datesArray.length - 1]);

			let lastMonthDays = getDaysBetween(lastSunday, datesArray[0]);
			let nextMonthDays = getDaysBetween(datesArray[datesArray.length - 1], nextSaturday);

			lastMonthDates.set(lastMonthDays);
			dates.set(datesArray);
			nextMonthDates.set(nextMonthDays);
		}
	});

	return {
		trigger,
		open,
		content,
		arrow,
		close,
		value,
		nextMonth,
		prevMonth,
		activeDate,
		nextYear,
		prevYear,
		dates,
		date,
		lastMonthDates,
		nextMonthDates,
	};
}
