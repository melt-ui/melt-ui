import { addMeltEventListener, builder } from '$lib/internal/helpers';
import type { MeltActionReturn } from '$lib/internal/types';

export function createLabel() {
	const root = builder('label', {
		action: (node: HTMLElement): MeltActionReturn<'mousedown'> => {
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
