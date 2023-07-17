import { addEventListener, builder, createElHelpers } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import type { CreateCollapsibleProps } from './types';

const defaults = {
	open: false,
	disabled: false,
} satisfies Defaults<CreateCollapsibleProps>;

const { name } = createElHelpers('collapsible');

export function createCollapsible(props?: CreateCollapsibleProps) {
	const options = { ...defaults, ...props };
	const disabled = writable(options.disabled);

	const open = writable(options.open);

	const root = builder(name(), {
		stores: open,
		returned: ($open) => ({
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': options.disabled ? '' : 'undefined',
		}),
	});

	const trigger = builder(name('trigger'), {
		stores: [open, disabled],
		returned: ([$open, $disabled]) =>
			({
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $disabled ? '' : undefined,
				disabled: $disabled,
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
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
		root,
		trigger,
		content,
		open,
		disabled,
	};
}
