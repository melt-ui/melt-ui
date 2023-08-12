import { ATTRS, KBD, PROPS, SEE, TYPES } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { toggleGroupEvents } from '$lib/builders/toggle-group/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'type',
		type: ["'single'", "'multiple'"],
		default: "'single'",
		description:
			'The type of toggle group. `single` allows a single item to be selected. `multiple` allows multiple items to be selected.',
	},
	PROPS.DISABLED,
	PROPS.LOOP,
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
];

const BUILDER_NAME = 'toggle group';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createToggleGroup',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: ['string', 'string[]'],
			description:
				'The value of the currently selected item. You can also pass an array of values to select multiple items if the toggle group is of type `multiple`.',
		},
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description:
				'A writable store that controls the value of the toggle group. If provided, this will override the value passed to `defaultValue`.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string | string[] | undefined>',
			description:
				'A callback called when the value of the `value` store should be changed. This is useful for controlling the value of the toggle group from outside the toggle group.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the toggle group root.',
		},
		{
			name: 'item',
			description: 'The builder store used to create toggle group items.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description: 'A writable store that returns the value of the currently selected item.',
		},
	],
	helpers: [
		{
			name: 'isPressed',
			type: 'Readable<(itemValue: string) => boolean>',
			description:
				'A derived store that takes an item value and returns whether or not the item is pressed.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
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
});

const item = elementSchema('item', {
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
	events: toggleGroupEvents['item'],
});

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

const schemas = [builder, root, item];

const features = [
	'Horizontal or vertical orientation',
	'Can be controlled or uncontrolled',
	'Full keyboard navigation',
];

export const toggleGroupData: BuilderData = {
	schemas,
	features,
	keyboard,
};
