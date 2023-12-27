import { styleToString } from './style.js';

export function disabledAttr(disabled: boolean | undefined) {
	return disabled ? true : undefined;
}

export const hiddenInputAttrs = {
	type: 'hidden',
	'aria-hidden': true,
	hidden: true,
	tabIndex: -1,
	style: styleToString({
		position: 'absolute',
		opacity: 0,
		'pointer-events': 'none',
		margin: 0,
		transform: 'translateX(-100%)',
	}),
};
