import { addEventListener } from '$lib/internal/helpers';
import { derived, get, writable } from 'svelte/store';

export type CreateToggleArgs = {
	disabled?: boolean;
	pressed?: boolean;
};

export function createToggle(args: CreateToggleArgs = {}) {
	const pressed = writable(args.pressed ?? false);
	const disabled = writable(args.disabled ?? false);

	const toggle = {
		...derived([pressed, disabled], ([$pressed, $disabled]) => {
			return {
				'data-disabled': $disabled ? true : undefined,
				disabled: $disabled,
				'data-state': $pressed ? 'on' : 'off',
				'aria-pressed': $pressed,
				type: 'button',
			} as const;
		}),
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
	};

	return {
		toggle,
		pressed,
		disabled,
	};
}
