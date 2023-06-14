import {
	effect,
	elementDerived,
	elementMulti,
	isBrowser,
	sleep,
	styleToString,
	uuid,
} from '$lib/internal/helpers';

import { usePopper, type FloatingConfig } from '$lib/internal/actions';
import { derived, readable, writable } from 'svelte/store';
import type { Defaults } from '$lib/internal/types';

export type CreatePopoverArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
};

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
} satisfies Defaults<CreatePopoverArgs>;

export function createPopover(args?: CreatePopoverArgs) {
	const options = { ...defaults, ...args } as CreatePopoverArgs;
	const positioning = readable(options.positioning);
	const arrowSize = readable(options.arrowSize);
	const open = writable(options.open);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: uuid(),
	};

	const content = elementDerived(
		[open, activeTrigger, positioning],
		([$open, $activeTrigger, $positioning], { addAction }) => {
			if ($open && $activeTrigger) {
				addAction(usePopper, {
					anchorElement: $activeTrigger,
					open,
					options: {
						floating: $positioning,
					},
				});
			}

			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.content,
			};
		}
	);

	const trigger = elementDerived([open], ([$open], { attach }) => {
		attach('click', (e) => {
			e.stopPropagation();
			const triggerEl = e.currentTarget as HTMLElement;

			open.update((prev) => {
				const isOpen = !prev;
				if (isOpen) {
					activeTrigger.set(triggerEl);
				} else {
					activeTrigger.set(null);
				}
				return isOpen;
			});
		});

		return {
			role: 'button' as const,
			'aria-haspopup': 'dialog' as const,
			'aria-expanded': $open,
			'data-state': $open ? 'open' : 'closed',
			'aria-controls': ids.content,
		};
	});

	const arrow = derived(arrowSize, ($arrowSize) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$arrowSize}px)`,
			height: `var(--arrow-size, ${$arrowSize}px)`,
		}),
	}));

	const close = elementMulti(({ attach }) => {
		return () => {
			attach('click', () => {
				open.set(false);
			});
			return {};
		};
	});

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return { trigger, open, content, arrow, close };
}
