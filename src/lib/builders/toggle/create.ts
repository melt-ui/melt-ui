import { addEventListener, builder } from '$lib/internal/helpers';
import { get, writable } from 'svelte/store';
import type { CreateToggleProps } from './types';

const defaults = {
	pressed: false,
	disabled: false,
} satisfies CreateToggleProps;
export function createToggle(props?: CreateToggleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToggleProps;

	const pressed = writable(withDefaults.pressed ?? false);

	const disabled = writable(withDefaults.disabled ?? false);

	const root = builder('toggle', {
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
		elements: {
			root,
		},
		options: {
			disabled,
		},
		states: {
			pressed,
		},
	};
}
