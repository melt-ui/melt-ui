import { addMeltEventListener, makeElement, withGet } from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { readonly } from 'svelte/store';
import type { LabelEvents } from './events.js';
import type { CreateLabelProps } from './types.js';

export function createLabel(props?: CreateLabelProps) {
	const forId = withGet.writable(props?.for);
	const id = withGet.writable(props?.id);
	const mounted = withGet.writable(false);

	const root = makeElement('label', {
		stores: [id, forId],
		returned([$id, $forId]) {
			return {
				id: $id,
				for: $forId,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<LabelEvents['root']> => {
			mounted.set(true);

			const unsub = addMeltEventListener(node, 'mousedown', (e) => {
				if (!e.defaultPrevented && e.detail > 1) {
					e.preventDefault();
				}
			});

			return {
				destroy: () => {
					unsub();
					mounted.set(false);
				},
			};
		},
	});

	return {
		elements: {
			root,
		},
		states: { mounted: readonly(mounted) },
		options: {
			id,
			for: forId,
		},
	};
}
