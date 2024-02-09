import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	getDirectionalKeys,
	getElemDirection,
	isBrowser,
	isHTMLElement,
	kbd,
	last,
	next,
	omit,
	overridable,
	prev,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { writable } from 'svelte/store';
import type { TabsEvents } from './events.js';
import type { CreateTabsProps, TabsTriggerProps } from './types.js';

const defaults = {
	orientation: 'horizontal',
	activateOnFocus: true,
	loop: true,
	autoSet: true,
} satisfies Defaults<CreateTabsProps>;

type TabsParts = 'list' | 'trigger' | 'content';
const { name, selector } = createElHelpers<TabsParts>('tabs');

export function createTabs(props?: CreateTabsProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateTabsProps;

	const options = toWritableStores(
		omit(withDefaults, 'defaultValue', 'value', 'onValueChange', 'autoSet')
	);
	const { orientation, activateOnFocus, loop } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	let ssrValue = withDefaults.defaultValue ?? value.get();

	// Root
	const root = makeElement(name(), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				'data-orientation': $orientation,
			};
		},
	});

	// List
	const list = makeElement(name('list'), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				role: 'tablist',
				'aria-orientation': $orientation,
				'data-orientation': $orientation,
			};
		},
	});

	const parseTriggerProps = (props: TabsTriggerProps) => {
		if (typeof props === 'string') {
			return { value: props };
		} else {
			return props;
		}
	};

	const trigger = makeElement(name('trigger'), {
		stores: [value, orientation],
		returned: ([$value, $orientation]) => {
			return (props: TabsTriggerProps) => {
				const { value: tabValue, disabled } = parseTriggerProps(props);

				if (!$value && !ssrValue && withDefaults.autoSet) {
					ssrValue = tabValue;
					$value = tabValue;
					value.set(tabValue);
				}

				const sourceOfTruth = isBrowser ? $value : ssrValue;
				const isActive = sourceOfTruth === tabValue;

				return {
					type: 'button' as const,
					role: 'tab',
					'data-state': isActive ? 'active' : 'inactive',
					tabindex: isActive ? 0 : -1,
					'data-value': tabValue,
					'data-orientation': $orientation,
					'data-disabled': disabledAttr(disabled),
					disabled: disabledAttr(disabled),
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TabsEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'focus', () => {
					const disabled = node.dataset.disabled === 'true';
					const tabValue = node.dataset.value;

					if (activateOnFocus.get() && !disabled && tabValue !== undefined) {
						value.set(tabValue);
					}
				}),

				addMeltEventListener(node, 'click', (e) => {
					node.focus();

					e.preventDefault();

					const disabled = node.dataset.disabled === 'true';
					if (disabled) return;

					const tabValue = node.dataset.value;
					node.focus();
					if (tabValue !== undefined) {
						value.set(tabValue);
					}
				}),

				addMeltEventListener(node, 'keydown', (e) => {
					const tabValue = node.dataset.value;
					if (!tabValue) return;

					const el = e.currentTarget;
					if (!isHTMLElement(el)) return;

					const rootEl = el.closest(selector());
					if (!isHTMLElement(rootEl)) return;

					const $loop = loop.get();

					const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')).filter(
						(trigger): trigger is HTMLElement => isHTMLElement(trigger)
					);
					const enabledTriggers = triggers.filter((el) => !el.hasAttribute('data-disabled'));
					const triggerIdx = enabledTriggers.findIndex((el) => el === e.target);

					const dir = getElemDirection(rootEl);
					const { nextKey, prevKey } = getDirectionalKeys(dir, orientation.get());

					if (e.key === nextKey) {
						e.preventDefault();
						const nextEl = next(enabledTriggers, triggerIdx, $loop);
						nextEl.focus();
					} else if (e.key === prevKey) {
						e.preventDefault();
						const prevEl = prev(enabledTriggers, triggerIdx, $loop);
						prevEl.focus();
					} else if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						value.set(tabValue);
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						const firstTrigger = enabledTriggers[0];
						firstTrigger.focus();
					} else if (e.key === kbd.END) {
						e.preventDefault();
						const lastTrigger = last(enabledTriggers);
						lastTrigger.focus();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	// Content
	const content = makeElement(name('content'), {
		stores: value,
		returned: ($value) => {
			return (tabValue: string) => {
				return {
					role: 'tabpanel',
					// TODO: improve
					'aria-labelledby': tabValue,
					hidden: isBrowser
						? $value === tabValue
							? undefined
							: true
						: ssrValue === tabValue
						? undefined
						: true,
					tabindex: 0,
				};
			};
		},
	});

	return {
		elements: {
			root,
			list,
			trigger,
			content,
		},
		states: {
			value,
		},
		options,
	};
}
