import { addMeltEventListener, makeElement, withGet } from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { readonly } from 'svelte/store';
import type { LabelEvents } from './events.js';
import type { CreateLabelProps } from './types.js';
import { parseProps } from '$lib/internal/helpers/props.js';

const defaults = {
	id: undefined,
	for: undefined,
} satisfies CreateLabelProps;

export function createLabel(props?: CreateLabelProps) {
	const { id, for: htmlFor } = parseProps(props, defaults);
	const mounted = withGet.writable(false);

	const root = makeElement('label', {
		stores: [id, htmlFor],
		returned([$id, $htmlFor]) {
			return {
				id: $id,
				for: $htmlFor,
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
			for: htmlFor,
		},
	};
}
