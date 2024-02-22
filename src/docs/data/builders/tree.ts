import { DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { treeEvents } from '$lib/builders/tree/events.js';
import type { BuilderData } from './index.js';

const BUILDER_NAME = 'tree-view';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createTreeView',
	description: DESCRIPTIONS.BUILDER('tree-view'),
	props: [
		PROPS.FORCE_VISIBLE,
		{
			name: 'defaultExpanded',
			type: 'string[]',
			description: 'Which tree items are expanded by default.',
			default: '[]',
		},
		{
			name: 'expanded',
			type: 'Writable<string[]>',
			description:
				'Optionally pass a writable store to control the expanded items of the tree. If provided, this will override the value of the `defaultTree` prop.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onExpandedChange',
			type: 'ChangeFn<string[]>',
			description: 'A callback called when the value of the `expanded` store should be changed.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'tree',
			description: 'The builder store used to create the tree.',
		},
		{
			name: 'item',
			description: 'The builder store used to create a tree item.',
		},
		{
			name: 'group',
			description: 'The builder store used to create a tree group.',
		},
	],
	states: [
		{
			name: 'expanded',
			type: 'Writable<string[]>',
			description: 'The list of IDs of items that are expanded.',
		},
		{
			name: 'selectedItem',
			type: 'Writable<HTMLElement | null>',
			description: 'The currently selected item, or `null` if no item is selected.',
		},
	],
	helpers: [
		{
			name: 'isExpanded',
			description: 'A function that returns whether or not the item is expanded.',
			type: 'Readable<(itemId: string) => boolean>',
		},
		{
			name: 'isSelected',
			description: 'A function that returns whether or not the item is selected.',
			type: 'Readable<(itemId: string) => boolean>',
		},
	],
});

const tree = elementSchema('tree', {
	title: 'tree',
	description: 'The tree list element.',
	dataAttributes: [
		{
			name: 'data-melt-id',
			value: 'A unique ID.',
		},
	],
});

const item = elementSchema('item', {
	title: 'item',
	description: 'The list item.',
	props: [
		{
			name: 'id',
			description: 'The unique ID of the item.',
			type: 'string',
			required: true,
		},
	],
	dataAttributes: [
		{
			name: 'data-id',
			value: 'A unique ID.',
		},
	],
	events: treeEvents['item'],
});

const group = elementSchema('group', {
	title: 'group',
	description: 'The list group item.',
	props: [
		{
			name: 'id',
			description: 'The unique ID of the group. Must match the ID of the item it belongs to.',
			type: 'string',
			required: true,
		},
	],
	dataAttributes: [
		{
			name: 'data-group-id',
			value: 'The unique ID of the list item the group belongs to.',
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.ENTER,
		behavior: 'Selects the node.',
	},
	{
		key: KBD.SPACE,
		behavior: 'Selects the node.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'Moves focus to the next node that is focusable without opening or closing a node. If focus is on the last node, does nothing.',
	},
	{
		key: KBD.ARROW_UP,
		behavior:
			'Moves focus to the previous node that is focusable without opening or closing a node. If focus is on the first node, does nothing.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior:
			'When focus is on a closed node, opens the node; focus does not move. When focus is on a open node, moves focus to the first child node. When focus is on an end node, does nothing.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior:
			'When focus is on an open node, closes the node. When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node. When focus is on a root node that is also either an end node or a closed node, does nothing.',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to first node without opening or closing a node.',
	},
	{
		key: KBD.END,
		behavior:
			'Moves focus to the last node that can be focused without expanding any nodes that are closed.',
	},
	{
		key: KBD.LETTER,
		behavior:
			'Focus moves to the next node with a name that starts with the typed character. Search wraps to first node if a matching name is not found among the nodes that follow the focused node. Search ignores nodes that are descendants of closed nodes.',
	},
];

const schemas = [builder, tree, item, group];

const features: BuilderData['features'] = [
	'Full keyboard functionality',
	'Select individual items',
];

export const treeData: BuilderData = {
	schemas,
	features,
	keyboard,
};
