import { getElementById, isBrowser, last, next, prev, uuid } from '$lib/internal/helpers';
import { derivedWithUnsubscribe, elementDerived } from '$lib/internal/stores';
import { writable } from 'svelte/store';

type CreateTabsArgs = {
	value?: string;
	onChange?: (value: string) => void;
	dir?: 'ltr' | 'rtl';
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
	loop?: boolean;
};

const defaults = {
	dir: 'ltr',
	orientation: 'horizontal',
	activateOnFocus: true,
	loop: true,
} satisfies CreateTabsArgs;

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
		'data-radix-id': uuid(),
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

	const trigger = elementDerived(value, ($value, attach) => {
		return (args: TriggerArgs) => {
			const { value: tabValue, disabled } = parseTriggerArgs(args);
			const triggerId = uuid();
			if (!$value && !ssrValue) {
				ssrValue = tabValue;
				value.set(tabValue);
			}

			// Event handlers
			attach(triggerId, 'focus', () => {
				if (options.activateOnFocus) {
					value.set(tabValue);
				}
			});

			attach(triggerId, 'click', (e) => {
				const el = e.currentTarget;
				if (el && 'focus' in el) {
					(el as HTMLElement).focus();
				}
			});

			const nextKey = {
				horizontal: options.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
				vertical: 'ArrowDown',
			}[options.orientation ?? 'horizontal'];

			const prevKey = {
				horizontal: options.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft',
				vertical: 'ArrowUp',
			}[options.orientation ?? 'horizontal'];

			attach(triggerId, 'keydown', (e) => {
				const rootEl = getElementById(root['data-radix-id']);
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
				} else if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					value.set(tabValue);
				} else if (e.key === 'Home') {
					e.preventDefault();
					enabledTriggers[0]?.focus();
				} else if (e.key === 'End') {
					e.preventDefault();
					last(enabledTriggers)?.focus();
				}
			});

			return {
				'data-radix-id': triggerId,
				role: 'tab',
				'data-state': isBrowser
					? $value === tabValue
						? 'active'
						: 'inactive'
					: ssrValue === tabValue
					? 'active'
					: 'inactive',
				tabIndex: $value === tabValue ? 0 : -1,
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
				tabIndex: 0,
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
