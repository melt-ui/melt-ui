import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createToolbar',
	description: DESCRIPTIONS.BUILDER('toolbar'),
	props: [
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.LOOP,
		},
		{
			label: 'orientation',
			type: TYPES.ORIENTATION,
			default: '"horizontal"',
			description: 'The orientation of the toolbar.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root toolbar element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-toolbar',
			value: ATTRS.MELT('toolbar'),
		},
	],
};

const button: APISchema = {
	title: 'button',
	description: 'The toolbar button element.',
	dataAttributes: [
		{
			label: 'data-melt-toolbar-button',
			value: ATTRS.MELT('toolbar button'),
		},
	],
};

const link: APISchema = {
	title: 'link',
	description: 'The toolbar link element.',
	dataAttributes: [
		{
			label: 'data-melt-toolbar-link',
			value: ATTRS.MELT('toolbar link'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'The toolbar separator element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-toolbar-separator',
			value: ATTRS.MELT('toolbar separator'),
		},
	],
};

const groupBuilder: APISchema = {
	title: 'createToolbarGroup',
	description: DESCRIPTIONS.BUILDER('toolbar group'),
	props: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
			description:
				'The type of toolbar group. A `single` group can only have one item selected at a time. A `multiple` group can have multiple items selected at a time.',
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'null'],
			description: 'The value of the selected item(s).',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toolbar group is disabled.',
		},
	],
};

const group: APISchema = {
	title: 'group',
	description: 'The root toolbar element for a toolbar group.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-toolbar-group',
			value: ATTRS.MELT('toolbar group'),
		},
	],
};

const groupItem: APISchema = {
	title: 'groupItem',
	description: 'A an item within a toolbar group.',
	props: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the item.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the item is disabled.',
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-toolbar-item',
			value: ATTRS.MELT('toolbar item'),
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			label: 'data-state',
			value: ATTRS.ON_OFF,
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the first item in the group.',
	},
	{
		key: KBD.SPACE,
		behavior: 'Toggles the state of the focused item.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Toggles the state of the focused item.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to the next item depending on `orientation`.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves focus to the next item depending on `orientation`.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to the previous item depending on `orientation`.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves focus to the previous item depending on `orientation`.',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to the first item.',
	},
	{
		key: KBD.END,
		behavior: 'Moves focus to the last item.',
	},
];

const schemas = {
	builder,
	root,
	button,
	link,
	separator,
	groupBuilder,
	group,
	groupItem,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Horizontal or vertical orientation',
];

export const toolbarData = {
	schemas,
	features,
};
