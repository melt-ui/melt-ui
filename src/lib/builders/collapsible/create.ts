import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	disabledAttr,
	omit,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { derived, writable } from 'svelte/store';
import type { CollapsibleEvents } from './events.js';
import type { CreateCollapsibleProps } from './types.js';

const defaults = {
	defaultOpen: false,
	disabled: false,
	forceVisible: false,
} satisfies CreateCollapsibleProps;

const { name } = createElHelpers('collapsible');

export function createCollapsible(props?: CreateCollapsibleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateCollapsibleProps;

	const options = toWritableStores(omit(withDefaults, 'open', 'defaultOpen', 'onOpenChange'));
	const { disabled, forceVisible } = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const root = makeElement(name(), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) =>
			({
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': disabledAttr($disabled),
			} as const),
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
			} as const),
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
