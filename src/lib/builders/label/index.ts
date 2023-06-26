import { addEventListener, hiddenAction } from '$lib/internal/helpers';

export function createLabel() {
	const root = hiddenAction({
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
		root,
	};
}
