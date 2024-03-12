import {
	addMeltEventListener,
	createElHelpers,
	disabledAttr,
	makeElement,
	styleToString,
} from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { derived } from 'svelte/store';
import type { CollapsibleEvents } from './events.js';
import type { CreateCollapsibleProps } from './types.js';

const defaults = {
	open: false,
	disabled: false,
	forceVisible: false,
} satisfies CreateCollapsibleProps;

const { name } = createElHelpers('collapsible');

export function createCollapsible(props?: CreateCollapsibleProps) {
	const { open, ...options } = parseProps(props, defaults);
	const { disabled, forceVisible } = options;

	const root = makeElement(name(), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': disabledAttr($disabled),
		}),
	});

	const trigger = makeElement(name('trigger'), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) =>
			({
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
			} as const),
		action: (node: HTMLElement): MeltActionReturn<CollapsibleEvents['trigger']> => {
			const unsub = addMeltEventListener(node, 'click', () => {
				const disabled = node.dataset.disabled !== undefined;
				if (disabled) return;
				open.update(($open) => !$open);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const isVisible = derived(
		[open, forceVisible],
		([$open, $forceVisible]) => $open || $forceVisible
	);

	const content = makeElement(name('content'), {
		stores: [isVisible, disabled],
		returned: ([$isVisible, $disabled]) => ({
			'data-state': $isVisible ? 'open' : 'closed',
			'data-disabled': disabledAttr($disabled),
			hidden: $isVisible ? undefined : true,
			style: styleToString({
				display: $isVisible ? undefined : 'none',
			}),
		}),
	});

	return {
		elements: {
			root,
			trigger,
			content,
		},
		states: {
			open,
		},
		options,
	};
}
