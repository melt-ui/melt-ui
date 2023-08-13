import { addMeltEventListener, builder } from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { LabelEvents } from './events.js';

export function createLabel() {
	const root = builder('label', {
		action: (node: HTMLElement): MeltActionReturn<LabelEvents['root']> => {
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
