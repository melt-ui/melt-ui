import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createToggleGroup',
	description: DESCRIPTIONS.BUILDER('toggle group'),
	props: [
		{
			name: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
			description:
				'The type of toggle group. `single` allows a single item to be selected. `multiple` allows multiple items to be selected.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toggle group is disabled.',
		},
		{
			name: 'value',
			type: ['string', 'string[]', 'null'],
			default: 'null',
			description:
				'The value of the currently selected item. You can also pass an array of values to select multiple items if the toggle group is of type `multiple`.',
		},
		{
			name: 'rovingFocus',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not the toggle group should use roving focus.',
		},
		{
			name: 'orientation',
			type: TYPES.ORIENTATION,
			default: "'horizontal'",
			description: 'The orientation of the toggle group.',
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.LOOP,
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root toggle group element.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-toggle-group',
			value: ATTRS.MELT('toggle group'),
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'The toggle group item element.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of the item.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the item is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-value',
			value: 'The value of the toggle item.',
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			name: 'data-state',
			value: ATTRS.ON_OFF,
		},
		{
			name: 'data-melt-toggle-group-item',
			value: ATTRS.MELT('toggle group item'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Moves focus to either the pressed item or the first item in the group.',
	},
	{
		key: KBD.SPACE,
		behavior: 'Activates/deactivates the item.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Activates/deactivates the item.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves focus to the next item in the group.',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves focus to the next item in the group.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves focus to the previous item in the group.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves focus to the previous item in the group.',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to the first item in the group.',
	},
	{
		key: KBD.END,
		behavior: 'Moves focus to the last item in the group.',
	},
];

const schemas = {
	builder,
	root,
	item,
	keyboard,
};

const features = [
	'Horizontal or vertical orientation',
	'Can be controlled or uncontrolled',
	'Full keyboard navigation',
];

export const toggleGroupData = {
	schemas,
	features,
};
