import {
	addEventListener,
	builder,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers';
import { get, readonly, writable } from 'svelte/store';
import type { CreateToggleProps } from './types';

const defaults = {
	defaultPressed: false,
	disabled: false,
} satisfies CreateToggleProps;
export function createToggle(props?: CreateToggleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToggleProps;

	const options = toWritableStores(omit(withDefaults, 'pressed'));
	const { disabled } = options;

	const pressedWritable = withDefaults.pressed ?? writable(withDefaults.defaultPressed);
	const pressed = overridable(pressedWritable, withDefaults?.onPressedChange);

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
		states: {
			pressed: readonly(pressed),
		},
		options,
	};
}
