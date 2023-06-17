import {
	derivedWithUnsubscribe,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	last,
	next,
	prev,
	uuid,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';

export type CreateTabsArgs = {
	value?: string;
	onChange?: (value: string) => void;
	dir?: 'ltr' | 'rtl';
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
	loop?: boolean;
	/** In case no value is set on initialization, sets the value to the first tab */
	autoSet?: boolean;
};

const defaults = {
	dir: 'ltr',
	orientation: 'horizontal',
	activateOnFocus: true,
	loop: true,
	autoSet: true,
} satisfies Defaults<CreateTabsArgs>;

export function createTabs(args?: CreateTabsArgs) {
	const options = { ...defaults, ...args };

	const value = writable(options.value);
	let ssrValue = options.value;
	value.subscribe((value) => {
		options.onChange?.(value);
	});

	// Root
	const root = {
		'data-orientation': options.orientation,
		'data-melt-id': uuid(),
	};

	// List
	const list = {
		role: 'tablist',
		'aria-orientation': options.orientation,
		'data-orientation': options.orientation,
	};

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

	const trigger = elementMultiDerived(value, ($value, { attach }) => {
		return (args: TriggerArgs) => {
			const { value: tabValue, disabled } = parseTriggerArgs(args);

			if (!$value && !ssrValue && options.autoSet) {
				ssrValue = tabValue;
				value.set(tabValue);
			}

			// Event handlers
			attach('focus', () => {
				if (options.activateOnFocus) {
					value.set(tabValue);
				}
			});

			attach('click', (e) => {
				const el = e.currentTarget;
				if (el && 'focus' in el) {
					(el as HTMLElement).focus();
				}
			});

			const nextKey = {
				horizontal: options.dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
				vertical: kbd.ARROW_DOWN,
			}[options.orientation ?? 'horizontal'];

			const prevKey = {
				horizontal: options.dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
				vertical: kbd.ARROW_UP,
			}[options.orientation ?? 'horizontal'];

			attach('keydown', (e) => {
				const rootEl = getElementByMeltId(root['data-melt-id']);
				if (!rootEl) return;
				const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')) as HTMLElement[];
				const enabledTriggers = triggers.filter((el) => !el.hasAttribute('data-disabled'));
				const triggerIdx = Array.from(enabledTriggers ?? []).findIndex((el) => el === e.target);

				if (e.key === nextKey) {
					e.preventDefault();
					next(enabledTriggers, triggerIdx, options.loop)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(enabledTriggers, triggerIdx, options.loop)?.focus();
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
				'data-orientation': options.orientation,
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
	};
}
