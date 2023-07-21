import {
	addMeltEventListener,
	builder,
	createElHelpers,
	omit,
	overridable,
	toWritableStores,
	type MeltEventHandler,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import type { CreateCollapsibleProps } from './types';
import type { ActionReturn } from 'svelte/action';

const defaults = {
	defaultOpen: false,
	disabled: false,
} satisfies Defaults<CreateCollapsibleProps>;

const { name } = createElHelpers('collapsible');

export function createCollapsible(props?: CreateCollapsibleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateCollapsibleProps;

	const options = toWritableStores(omit(withDefaults, 'open'));
	const { disabled } = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const root = builder(name(), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $disabled ? '' : 'undefined',
		}),
	});

	type TriggerEvents = {
		'on:m-click': MeltEventHandler<MouseEvent>;
	};
	const trigger = builder(name('trigger'), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) =>
			({
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $disabled ? '' : undefined,
				disabled: $disabled,
			} as const),
		action: (node: HTMLElement): ActionReturn<unknown, TriggerEvents> => {
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

	const content = builder(name('content'), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $disabled ? '' : undefined,
			hidden: $open ? undefined : true,
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
