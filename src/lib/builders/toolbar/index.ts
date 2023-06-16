import { elementMultiDerived, kbd } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

type CreateToolbarArgs = {
	loop?: boolean;
	orientation?: 'horizontal' | 'vertical';
};

const defaults = {
	loop: true,
	orientation: 'horizontal',
} satisfies Defaults<CreateToolbarArgs>;

export function createToolbar(args: CreateToolbarArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });

	const root = derived(options, ($options) => {
		return {
			role: 'toolbar',
			tabindex: 0,
			'data-orientation': $options.orientation,
			'data-melt-part': 'toolbar',
		};
	});

	const button = elementMultiDerived(options, ($options, { attach }) => {
		return () => {
			attach('keydown', getKeydownHandler($options));
			return {
				role: 'button',
				type: 'button',
				'data-melt-part': 'toolbar-item',
			} as const;
		};
	});

	const link = elementMultiDerived(options, ($options, { attach }) => {
		return () => {
			attach('keydown', getKeydownHandler($options));

			return {
				role: 'link',
				'data-melt-part': 'toolbar-item',
			} as const;
		};
	});

	const separator = derived(options, ($options) => {
		return {
			role: 'separator',
			'data-orientation': $options.orientation === 'horizontal' ? 'vertical' : 'horizontal',
			'aria-orientation': $options.orientation === 'horizontal' ? 'vertical' : 'horizontal',
		} as const;
	});

	return {
		root,
		options,
		button,
		link,
		separator,
	};
}

export const getKeydownHandler = (options: Pick<CreateToolbarArgs, 'orientation' | 'loop'>) => {
	const dir = 'ltr' as 'ltr' | 'rtl';
	const nextKey = {
		horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
		vertical: kbd.ARROW_DOWN,
	}[options.orientation ?? 'horizontal'];

	const prevKey = {
		horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
		vertical: kbd.ARROW_UP,
	}[options.orientation ?? 'horizontal'];

	return (e: KeyboardEvent) => {
		const el = e.currentTarget as HTMLElement;
		const root = el.closest('[data-melt-part="toolbar"]') as HTMLElement;

		const items = Array.from(
			root.querySelectorAll('[data-melt-part="toolbar-item"]')
		) as Array<HTMLElement>;
		const currentIndex = items.indexOf(el);

		if (e.key === nextKey) {
			e.preventDefault();
			const nextIndex = currentIndex + 1;
			if (nextIndex >= items.length) {
				if (options.loop) {
					items[0].focus();
				}
			} else {
				items[nextIndex].focus();
			}
		} else if (e.key === prevKey) {
			e.preventDefault();
			const prevIndex = currentIndex - 1;
			if (prevIndex < 0) {
				if (options.loop) {
					items[items.length - 1].focus();
				}
			} else {
				items[prevIndex].focus();
			}
		} else if (e.key === kbd.HOME) {
			e.preventDefault();
			items[0].focus();
		} else if (e.key === kbd.END) {
			e.preventDefault();
			items[items.length - 1].focus();
		}
	};
};
