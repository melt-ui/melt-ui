import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	getDirectionalKeys,
	isBrowser,
	kbd,
	last,
	next,
	omit,
	prev,
} from '$lib/internal/helpers';
import { getElemDirection } from '$lib/internal/helpers/locale';
import type { Defaults } from '$lib/internal/types';
import { get, writable } from 'svelte/store';
import type { CreateTabsProps, TabsTriggerProps } from './types';

const defaults = {
	orientation: 'horizontal',
	activateOnFocus: true,
	loop: true,
	autoSet: true,
} satisfies Defaults<CreateTabsProps>;

type TabsParts = 'list' | 'trigger' | 'content';
const { name, selector } = createElHelpers<TabsParts>('tabs');

export function createTabs(props?: CreateTabsProps) {
	const withDefaults = { ...defaults, ...props };
	const options = writable(omit(withDefaults, 'value'));

	const value = writable(withDefaults.value);
	let ssrValue = withDefaults.value;
	value.subscribe((value) => {
		withDefaults.onChange?.(value);
	});

	// Root
	const root = builder(name(), {
		stores: options,
		returned: ($options) => {
			return {
				'data-orientation': $options.orientation,
			};
		},
	});

	// List
	const list = builder(name('list'), {
		stores: options,
		returned: ($options) => {
			return {
				role: 'tablist',
				'aria-orientation': $options.orientation,
				'data-orientation': $options.orientation,
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

	const trigger = builder(name('trigger'), {
		stores: [value, options],
		returned: ([$value, $options]) => {
			return (props: TabsTriggerProps) => {
				const { value: tabValue, disabled } = parseTriggerProps(props);

				if (!$value && !ssrValue && $options.autoSet) {
					ssrValue = tabValue;
					value.set(tabValue);
				}

				return {
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
					'data-orientation': $options.orientation,
					'data-disabled': disabled ? true : undefined,
					disabled,
				};
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'focus', () => {
					const $options = get(options);
					const disabled = node.dataset.disabled === 'true';
					const tabValue = node.dataset.value;

					if ($options.activateOnFocus && !disabled && tabValue !== undefined) {
						value.set(tabValue);
					}
				}),

				addEventListener(node, 'pointerdown', (e) => {
					const isLeftClick = e.button === 0;
					if (!isLeftClick) {
						e.preventDefault();
						return;
					}

					const disabled = node.dataset.disabled === 'true';
					if (disabled) return;

					const tabValue = node.dataset.value;
					node.focus();
					if (tabValue !== undefined) {
						value.set(tabValue);
					}
				}),

				addEventListener(node, 'keydown', (e) => {
					const tabValue = node.dataset.value;

					const el = e.currentTarget as HTMLElement;
					const rootEl = el.closest(selector()) as HTMLElement | null;

					if (!rootEl || !tabValue) return;

					const $options = get(options);

					const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')) as HTMLElement[];
					const enabledTriggers = triggers.filter((el) => !el.hasAttribute('data-disabled'));
					const triggerIdx = Array.from(enabledTriggers ?? []).findIndex((el) => el === e.target);

					const dir = getElemDirection(rootEl);
					const { nextKey, prevKey } = getDirectionalKeys(dir, $options.orientation);

					if (e.key === nextKey) {
						e.preventDefault();
						next(enabledTriggers, triggerIdx, $options.loop)?.focus();
					} else if (e.key === prevKey) {
						e.preventDefault();
						prev(enabledTriggers, triggerIdx, $options.loop)?.focus();
					} else if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						value.set(tabValue);
					} else if (e.key === kbd.HOME) {
						e.preventDefault();
						enabledTriggers[0]?.focus();
					} else if (e.key === kbd.END) {
						e.preventDefault();
						last(enabledTriggers)?.focus();
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
		value,
		options,
		root: root,
		list: list,
		trigger: trigger,
		content: content,
	};
}
