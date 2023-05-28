import { generateId, isBrowser, next, prev } from '$lib/internal/helpers';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';

type CreateTabsArgs = {
	value?: string;
	dir?: 'ltr' | 'rtl';
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
};

const defaults = {
	dir: 'ltr',
	orientation: 'horizontal',
	activateOnFocus: true,
} satisfies CreateTabsArgs;

export function createTabs(args?: CreateTabsArgs) {
	const options = { ...defaults, ...args };

	const value = writable(options.value);

	// Root
	const root = {
		'data-orientation': options.orientation,
		id: generateId(),
	};

	// List
	const list = {
		role: 'tablist',
		'aria-orientation': options.orientation,
	};

	// Trigger
	const trigger = derived(value, ($value) => {
		return (tabValue: string) => {
			const id = generateId();

			// Event handlers
			const onFocus = () => {
				if (options.activateOnFocus) {
					value.set(tabValue);
				}
			};

			const onClick = (e: MouseEvent) => {
				const el = e.currentTarget;
				if (el && 'focus' in el) {
					(el as HTMLElement).focus();
				}
			};

			const nextKey = {
				horizontal: options.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
				vertical: 'ArrowDown',
			}[options.orientation ?? 'horizontal'];

			const prevKey = {
				horizontal: options.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft',
				vertical: 'ArrowUp',
			}[options.orientation ?? 'horizontal'];

			const onKeyDown = (e: KeyboardEvent) => {
				const rootEl = document.getElementById(root.id);
				if (!rootEl) return;
				const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')) as HTMLElement[];
				const triggerIdx = Array.from(triggers ?? []).findIndex((el) => el === e.target);

				if (e.key === nextKey) {
					e.preventDefault();
					next(triggers, triggerIdx)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(triggers, triggerIdx)?.focus();
				} else if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					value.set(tabValue);
				}
			};

			if (isBrowser) {
				tick().then(() => {
					const el = document.getElementById(id);
					el?.addEventListener('focus', onFocus);
					el?.addEventListener('click', onClick);
					el?.addEventListener('keydown', onKeyDown);
				});
			}

			return {
				id,
				role: 'tab',
				'data-state': $value === tabValue ? 'active' : 'inactive',
				tabIndex: $value === tabValue ? 0 : -1,
				'data-orientation': options.orientation,
			};
		};
	});

	// Content
	const content = derived(value, ($value) => {
		return (tabValue: string) => {
			return {
				role: 'tabpanel',
				// TODO: improve
				'aria-labelledby': tabValue,
				hidden: $value === tabValue ? undefined : true,
				tabIndex: 0,
			};
		};
	});

	// Set event handlers

	return {
		value,
		root: root,
		list: list,
		trigger: trigger,
		content: content,
	};
}
