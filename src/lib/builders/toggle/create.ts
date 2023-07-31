import {
	builder,
	omit,
	toWritableStores,
	addMeltEventListener,
	kbd,
	executeCallbacks,
	overridable,
} from '$lib/internal/helpers';
import { get, writable } from 'svelte/store';
import type { CreateToggleProps } from './types';
import type { MeltActionReturn } from '$lib/internal/types';

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

	function handleToggle() {
		const $disabled = get(disabled);
		if ($disabled) return;
		pressed.update((v) => !v);
	}

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
		action: (node: HTMLElement): MeltActionReturn<'click'> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					handleToggle();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					handleToggle();
				})
			);

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
