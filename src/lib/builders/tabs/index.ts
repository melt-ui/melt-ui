import {
	derivedWithUnsubscribe,
	elementMultiDerived,
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
import { derived, writable } from 'svelte/store';

export type CreateTabsArgs = {
	value?: string;
	onChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
	loop?: boolean;
	/** In case no value is set on initialization, sets the value to the first tab */
	autoSet?: boolean;
};

const defaults = {
	orientation: 'horizontal',
	activateOnFocus: true,
	loop: true,
	autoSet: true,
} satisfies Defaults<CreateTabsArgs>;

export function createTabs(args?: CreateTabsArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'value'));

	const value = writable(withDefaults.value);
	let ssrValue = withDefaults.value;
	value.subscribe((value) => {
		withDefaults.onChange?.(value);
	});

	// Root
	const root = derived(options, ($options) => {
		return {
			'data-orientation': $options.orientation,
			'data-melt-part': 'tabs-root',
		};
	});

	// List
	const list = derived(options, ($options) => {
		return {
			role: 'tablist',
			'aria-orientation': $options.orientation,
			'data-orientation': $options.orientation,
		};
	});

	// Trigger
	type TriggerArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;

	const parseTriggerArgs = (args: TriggerArgs) => {
		if (typeof args === 'string') {
			return { value: args };
		} else {
			return args;
		}
	};

	const trigger = elementMultiDerived([value, options], ([$value, $options], { attach }) => {
		return (args: TriggerArgs) => {
			const { value: tabValue, disabled } = parseTriggerArgs(args);

			if (!$value && !ssrValue && $options.autoSet) {
				ssrValue = tabValue;
				value.set(tabValue);
			}

			// Event handlers
			attach('focus', () => {
				if ($options.activateOnFocus) {
					value.set(tabValue);
				}
			});

			attach('click', (e) => {
				const el = e.currentTarget;
				if (el && 'focus' in el) {
					(el as HTMLElement).focus();
				}
			});

			attach('keydown', (e) => {
				const el = e.currentTarget as HTMLElement;
				const rootEl = el.closest('[data-melt-part="tabs-root"]') as HTMLElement | null;
				console.log(rootEl);
				if (!rootEl) return;

				const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')) as HTMLElement[];
				const enabledTriggers = triggers.filter((el) => !el.hasAttribute('data-disabled'));
				const triggerIdx = Array.from(enabledTriggers ?? []).findIndex((el) => el === e.target);

				const dir = getElemDirection(rootEl);
				const { nextKey, prevKey } = getDirectionalKeys(dir, $options.orientation);

				console.log(nextKey, prevKey);
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
			});

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
				'data-orientation': $options.orientation,
				'data-disabled': disabled ? '' : undefined,
				disabled,
			};
		};
	});

	// Content
	const content = derivedWithUnsubscribe(value, ($value) => {
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
	});

	return {
		value,
		root: root,
		list: list,
		trigger: trigger,
		content: content,
		options,
	};
}
