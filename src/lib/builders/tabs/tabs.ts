import { isBrowser, next, prev } from '$lib/internal/helpers';
import { tick } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';

type CreateTabsArgs = {
	value?: string;
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

const hackDerived = <T>(store: Writable<T>, fn: (value: T) => void) => {
	return {
		subscribe: () => {
			return store.subscribe(fn);
		},
	};
};

let idCount = 0;

function generateId() {
	return `${idCount++}`;
}

function getElementById(id: string) {
	return document.querySelector(`[data-radix-id="${id}"]`) as HTMLElement | null;
}

export function createTabs(args?: CreateTabsArgs) {
	const options = { ...defaults, ...args };

	const value = writable(options.value);

	// Root
	const root = {
		'data-orientation': options.orientation,
		'data-radix-id': generateId(),
	};

	// List
	const list = {
		role: 'tablist',
		'aria-orientation': options.orientation,
	};

	// Trigger

	let counter = 0;
	let unsubscribers: (() => void)[] = [];
	const trigger = derived(value, ($value) => {
		console.log('derived');
		counter = 0;
		unsubscribers.forEach((fn) => fn());
		unsubscribers = [];
		return (tabValue: string) => {
			const triggerId = generateId();
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
				const rootEl = getElementById(root['data-radix-id']);
				if (!rootEl) return;
				const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')) as HTMLElement[];
				const triggerIdx = Array.from(triggers ?? []).findIndex((el) => el === e.target);

				if (e.key === nextKey) {
					e.preventDefault();
					next(triggers, triggerIdx, options.loop)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(triggers, triggerIdx, options.loop)?.focus();
				} else if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					value.set(tabValue);
				}
			};

			if (isBrowser) {
				counter++;
				console.log('innerderived from', counter);
				tick().then(() => {
					const el = getElementById(triggerId);
					el?.addEventListener('focus', onFocus);
					el?.addEventListener('click', onClick);
					el?.addEventListener('keydown', onKeyDown);
				});

				unsubscribers.push(() => {
					const el = getElementById(triggerId);
					el?.removeEventListener('focus', onFocus);
					el?.removeEventListener('click', onClick);
					el?.removeEventListener('keydown', onKeyDown);
				});
			}

			return {
				'data-radix-id': triggerId,
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
