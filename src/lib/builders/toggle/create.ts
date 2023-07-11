import { addEventListener, builder } from '$lib/internal/helpers';
import { get, writable } from 'svelte/store';
import type { CreateToggleArgs } from './types';

export function createToggle(args: CreateToggleArgs = {}) {
	const pressed = writable(args.pressed ?? false);
	const disabled = writable(args.disabled ?? false);

	const toggle = builder('toggle', {
		stores: [pressed, disabled],
		returned: ([$pressed, $disabled]) => {
			return {
				'data-disabled': $disabled ? true : undefined,
				disabled: $disabled,
				'data-state': $pressed ? 'on' : 'off',
				'aria-pressed': $pressed,
				type: 'button',
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				const $disabled = get(disabled);
				if ($disabled) return;
				pressed.update((v) => !v);
			});

			return {
				destroy: unsub,
			};
		},
	});

	return {
		pressed,
		disabled,
		root: toggle,
		toggle,
	};
}
