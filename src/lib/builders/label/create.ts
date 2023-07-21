import { addMeltEventListener, builder, type MeltEventHandler } from '$lib/internal/helpers';
import type { ActionReturn } from 'svelte/action';

export function createLabel() {
	type RootEvents = {
		'on:m-mousedown'?: MeltEventHandler<MouseEvent>;
	};
	const root = builder('label', {
		action: (node: HTMLElement): ActionReturn<unknown, RootEvents> => {
			const mouseDown = addMeltEventListener(node, 'mousedown', (e) => {
				if (!e.defaultPrevented && e.detail > 1) {
					e.preventDefault();
				}
			});

			return {
				destroy: mouseDown,
			};
		},
	});

	return {
		elements: {
			root,
		},
	};
}
