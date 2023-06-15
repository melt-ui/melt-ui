import {
	elementDerived,
	getElementByMeltId,
	omit,
	styleToString,
	uuid,
} from '$lib/internal/helpers';

import { usePopper, type FloatingConfig } from '$lib/internal/actions';
import { derived, writable, type Readable } from 'svelte/store';
import type { Defaults } from '$lib/internal/types';

export type CreateTooltipArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
};

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
	closeOnPointerDown: true,
	openDelay: 1000,
	closeDelay: 500,
} satisfies Defaults<CreateTooltipArgs>;

// TODO: Add grace area to prevent tooltip from closing when moving from trigger to tooltip

export function createTooltip(args?: CreateTooltipArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTooltipArgs;
	const options = writable(omit(withDefaults, 'open'));

	const open = writable(withDefaults.open);

	const ids = {
		content: uuid(),
	};

	let timeout: number | null = null;

	const openTooltip = derived(options, ($options) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(true);
			}, $options.openDelay);
		};
	}) as Readable<() => void>;

	const closeTooltip = derived(options, ($options) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(false);
			}, $options.closeDelay);
		};
	}) as Readable<() => void>;

	const trigger = elementDerived(
		[open, openTooltip, closeTooltip, options],
		([$open, $openTooltip, $closeTooltip, $options], { attach }) => {
			attach('mouseover', $openTooltip);
			attach('mouseout', $closeTooltip);
			attach('focus', () => open.set(true));
			attach('blur', () => open.set(false));
			if ($options.closeOnPointerDown) {
				attach('pointerdown', () => open.set(false));
			}

			return {
				role: 'button' as const,
				'aria-haspopup': 'dialog' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
			};
		}
	);

	const content = elementDerived(
		[open, trigger, options, openTooltip, closeTooltip],
		([$open, $trigger, $options, $openTooltip, $closeTooltip], { addAction, attach }) => {
			const triggerEl = getElementByMeltId($trigger['data-melt-id']);
			if ($open && triggerEl) {
				addAction(usePopper, {
					anchorElement: triggerEl,
					open,
					options: {
						floating: $options.positioning,
						focusTrap: null,
					},
				});
			}

			attach('mouseover', $openTooltip);
			attach('mouseout', $closeTooltip);

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

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	return { trigger, open, content, arrow, options };
}
