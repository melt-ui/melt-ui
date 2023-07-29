import {
	builder,
	createElHelpers,
	executeCallbacks,
	getDirectionalKeys,
	isBrowser,
	kbd,
	last,
	next,
	prev,
	toWritableStores,
	isHTMLElement,
	omit,
	getElemDirection,
	overridable,
	type MeltEventHandler,
	addMeltEventListener,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { get, writable } from 'svelte/store';
import type { CreateTabsProps, TabsTriggerProps } from './types';
import type { ActionReturn } from 'svelte/action';

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

	const options = toWritableStores(omit(withDefaults, 'defaultValue', 'value', 'onValueChange'));
	const { orientation, activateOnFocus, loop, autoSet } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	let ssrValue = withDefaults.defaultValue;

	// Root
	const root = builder(name(), {
		stores: orientation,
		returned: ($orientation) => {
			return {
				'data-orientation': $orientation,
			};
		},
	});

	// List
	const list = builder(name('list'), {
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

	type TriggerEvents = {
		'on:m-focus'?: MeltEventHandler<FocusEvent>;
		'on:m-click'?: MeltEventHandler<MouseEvent>;
		'on:m-keydown'?: MeltEventHandler<KeyboardEvent>;
	};

	const trigger = builder(name('trigger'), {
		stores: [value, autoSet, orientation],
		returned: ([$value, $autoSet, $orientation]) => {
			return (props: TabsTriggerProps) => {
				const { value: tabValue, disabled } = parseTriggerProps(props);

				if (!$value && !ssrValue && $autoSet) {
					ssrValue = tabValue;
					value.set(tabValue);
				}

				return {
					type: 'button',
					role: 'tab',
					'data-state': isBrowser
						? $value === tabValue
							? 'active'
							: 'inactive'
						: ssrValue === tabValue
						? 'active'
						: 'inactive',
					tabindex: $value === tabValue ? 0 : -1,
					'data-value': tabValue,
					'data-orientation': $orientation,
					'data-disabled': disabled ? true : undefined,
					disabled,
				};
			};
		},
		action: (node: HTMLElement): ActionReturn<unknown, TriggerEvents> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'focus', () => {
					const disabled = node.dataset.disabled === 'true';
					const tabValue = node.dataset.value;

					if (get(activateOnFocus) && !disabled && tabValue !== undefined) {
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

					const $loop = get(loop);

					const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')).filter(
						(trigger): trigger is HTMLElement => isHTMLElement(trigger)
					);
					const enabledTriggers = triggers.filter((el) => !el.hasAttribute('data-disabled'));
					const triggerIdx = enabledTriggers.findIndex((el) => el === e.target);

					const dir = getElemDirection(rootEl);
					const { nextKey, prevKey } = getDirectionalKeys(dir, get(orientation));

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
	const content = builder(name('content'), {
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
