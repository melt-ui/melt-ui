import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	disabledAttr,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	generateIds,
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

export const collapsibleIdParts = ['content'] as const;
export type CollapsibleIdParts = typeof collapsibleIdParts;

const { name } = createElHelpers('collapsible');

export function createCollapsible(props?: CreateCollapsibleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateCollapsibleProps;

	const options = toWritableStores(omit(withDefaults, 'open', 'defaultOpen', 'onOpenChange'));
	const { disabled, forceVisible } = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const ids = toWritableStores({
		...generateIds(collapsibleIdParts),
		...withDefaults.ids,
	});

	const root = makeElement(name(), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': disabledAttr($disabled),
		}),
	});

	const trigger = makeElement(name('trigger'), {
		stores: [open, disabled, ids.content],
		returned: ([$open, $disabled, $contentId]) =>
			({
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
				'aria-expanded': $open ? 'true' : 'false',
				'aria-controls': $contentId,
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
		stores: [isVisible, disabled, ids.content],
		returned: ([$isVisible, $disabled, $contentId]) => ({
			'data-state': $isVisible ? 'open' : 'closed',
			'data-disabled': disabledAttr($disabled),
			hidden: $isVisible ? undefined : true,
			id: $contentId,
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
