import { DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTreeViewBuilder',
	description: DESCRIPTIONS.BUILDER('tree-view'),
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
		key: KBD.ENTER,
		behavior: 'Selects the node.'
	},
	{
		key: KBD.SPACE,
		behavior: 'Selects the node.'
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to the next node that is focusable without opening or closing a node. If focus is on the last node, does nothing.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to the previous node that is focusable without opening or closing a node. If focus is on the first node, does nothing.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'When focus is on a closed node, opens the node; focus does not move. When focus is on a open node, moves focus to the first child node. When focus is on an end node, does nothing.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'When focus is on an open node, closes the node. When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node. When focus is on a root node that is also either an end node or a closed node, does nothing.',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to first node without opening or closing a node.'
	},
	{
		key: KBD.END,
		behavior: 'Moves focus to the last node that can be focused without expanding any nodes that are closed.'
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
