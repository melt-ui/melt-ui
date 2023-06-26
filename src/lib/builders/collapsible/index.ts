import { addEventListener } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

export type CreateCollapsibleArgs = {
	open?: boolean;
	disabled?: boolean;
};

const defaults = {
	open: false,
	disabled: false,
} satisfies Defaults<CreateCollapsibleArgs>;

export function createCollapsible(args?: CreateCollapsibleArgs) {
	const options = { ...defaults, ...args };
	const disabled = writable(options.disabled);

	const open = writable(options.open);
	const root = derived(open, ($open) => ({
		'data-state': $open ? 'open' : 'closed',
		'data-disabled': options.disabled ? true : 'undefined',
	}));

	const trigger = {
		...derived([open, disabled], ([$open, $disabled]) => {
			return {
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $disabled ? true : undefined,
			};
		}),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.update(($open) => !$open);
			});

			return {
				destroy: unsub,
			};
		},
	};

	const content = derived([open, disabled], ([$open, $disabled]) => ({
		'data-state': $open ? 'open' : 'closed',
		'data-disabled': $disabled ? true : undefined,
		hidden: $open ? undefined : true,
	}));

	return {
		root,
		trigger,
		content,
		open,
		disabled,
	};
}
