import { makeElement } from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { Defaults } from '$lib/internal/types.js';
import type { CreateSeparatorProps } from './types.js';

const defaults = {
	orientation: 'horizontal',
	decorative: false,
} satisfies Defaults<CreateSeparatorProps>;

export const createSeparator = (props?: CreateSeparatorProps) => {
	const options = parseProps(props, defaults);
	const { orientation, decorative } = options;

	const root = makeElement('separator', {
		stores: [orientation, decorative],
		returned: ([$orientation, $decorative]) => {
			const ariaOrientation = $orientation === 'vertical' ? $orientation : undefined;
			return {
				role: $decorative ? 'none' : 'separator',
				'aria-orientation': ariaOrientation,
				'aria-hidden': $decorative,
				'data-orientation': $orientation,
			};
		},
	});

	return {
		elements: {
			root,
		},
		options,
	};
};
