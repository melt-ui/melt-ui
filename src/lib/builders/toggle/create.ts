import {
	builder,
	omit,
	toWritableStores,
	type MeltEventHandler,
	addMeltEventListener,
} from '$lib/internal/helpers';
import { get, writable } from 'svelte/store';
import type { CreateToggleProps } from './types';
import type { ActionReturn } from 'svelte/action';

const defaults = {
	pressed: false,
	disabled: false,
} satisfies CreateToggleProps;
export function createToggle(props?: CreateToggleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToggleProps;

	const options = toWritableStores(omit(withDefaults, 'pressed'));
	const { disabled } = options;

	const pressed = writable(withDefaults.pressed ?? false);

	type RootEvents = {
		'on:m-click'?: MeltEventHandler<MouseEvent>;
	};

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
		action: (node: HTMLElement): ActionReturn<unknown, RootEvents> => {
			const unsub = addMeltEventListener(node, 'click', () => {
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
			pressed,
		},
		options,
	};
}
