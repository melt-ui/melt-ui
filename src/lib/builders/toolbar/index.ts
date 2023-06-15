import { elementMulti, elementMultiDerived, isBrowser } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';

type CreateToolbarArgs = {};

const defaults = {} satisfies Defaults<CreateToolbarArgs>;

export function createToolbar(args: CreateToolbarArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });

	const root = {
		role: 'toolbar',
		tabindex: 0,
	};

	const stores = [];

	const toggleGroup = elementMultiDerived(options, ($options, { attach, index }) => {
		return () => {
			attach('test', (e) => {
				e.stopPropagation();
				console.log(index, e);
			});
		};
	});

	const toggleItem = elementMultiDerived(options, ($options, { attach, index }) => {
		return (value: string) => {
			attach('click', (e) => {
				const el = e.target as HTMLElement;
				// send custom event test
				const ev = new CustomEvent('test', { bubbles: true });
				el.dispatchEvent(ev);
			});

			return {};
		};
	});

	return {
		root,
		options,
		toggleGroup,
		toggleItem,
	};
}
