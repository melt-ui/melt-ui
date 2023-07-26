import { ATTRS, DESCRIPTIONS, KBD, LONG_TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTooltip',
	description: DESCRIPTIONS.BUILDER('tooltip'),
	props: [
	],
	returnedProps: [
		{
			name: 'tree',
			description: 'The builder store used to create the tree.',
			link: '#tree',
		},
		{
			name: 'label',
			description: 'The builder store used to create the label.',
			link: '#label',
		},
		{
			name: 'item',
			description: 'The builder store used to create a tree item.',
			link: '#item',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to the next node that is focusable without opening or closing a node. If focus is on the last node, does nothing.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to the previous node that is focusable without opening or closing a node. If focus is on the first node, does nothing.',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to first node without opening or closing a node.'
	},
	{
		key: KBD.END,
		behavior: '	Moves focus to the last node that can be focused without expanding any nodes that are closed.'
	},
	{
		key: KBD.LETTER,
		behavior: 'Focus moves to the next node with a name that starts with the typed character. Search wraps to first node if a matching name is not found among the nodes that follow the focused node. Search ignores nodes that are descendants of closed nodes.'
	}
];

const schemas = [builder];

const features: BuilderData['features'] = [
	'Full keyboard functionality',
];

export const treeData: BuilderData = {
	schemas,
	features,
	keyboard
};
