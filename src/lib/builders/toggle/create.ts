import {
	addMeltEventListener,
	disabledAttr,
	executeCallbacks,
	kbd,
	makeElement,
	omit,
	toWritableStores
} from '$lib/internal/helpers/index.js';
import { parseProp } from '$lib/internal/helpers/props.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { ToggleEvents } from './events.js';
import type { CreateToggleProps } from './types.js';

const defaults = {
	pressed: false,
	disabled: false,
} satisfies CreateToggleProps;

export function createToggle(props?: CreateToggleProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToggleProps;

	const options = toWritableStores(omit(withDefaults, 'pressed'));
	const { disabled } = options;

	const pressed = parseProp(withDefaults.pressed);

	function handleToggle() {
		const $disabled = disabled.get();
		if ($disabled) return;
		pressed.update((v) => !v);
	}

	const root = makeElement('toggle', {
		stores: [pressed, disabled],
		returned: ([$pressed, $disabled]) => {
			return {
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
				'data-state': $pressed ? 'on' : 'off',
				'aria-pressed': $pressed,
				type: 'button',
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<ToggleEvents['root']> => {
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
