import {
	addMeltEventListener,
	builder,
	createElHelpers,
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

	const root = builder(name(), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $disabled ? '' : 'undefined',
		}),
	});

	const trigger = builder(name('trigger'), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => {
			const disabledVal = $disabled ? '' : undefined;
			return {
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': disabledVal,
				disabled: disabledVal,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<CollapsibleEvents['trigger']> => {
			const unsub = addMeltEventListener(node, 'click', () => {
				const disabled = node.hasAttribute('data-disabled');
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

	const content = builder(name('content'), {
		stores: [isVisible, disabled],
		returned: ([$isVisible, $disabled]) => {
			return {
				'data-state': $isVisible ? 'open' : 'closed',
				'data-disabled': $disabled ? '' : undefined,
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
			};
		},
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
