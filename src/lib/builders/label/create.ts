import { addEventListener, builder } from '$lib/internal/helpers';

export function createLabel() {
	const root = builder('label', {
		action: (node: HTMLElement) => {
			const mouseDown = addEventListener(node, 'mousedown', (e) => {
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
