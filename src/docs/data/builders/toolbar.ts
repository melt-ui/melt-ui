import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.LOOP,
	{
		name: 'orientation',
		type: TYPES.ORIENTATION,
		default: '"horizontal"',
		description: 'The orientation of the toolbar.',
	},
];

const builder: APISchema = {
	title: 'createToolbar',
	description: DESCRIPTIONS.BUILDER('toolbar'),
	props: genProps('toolbar', OPTION_PROPS),
	elements: genElements('toolbar', [
		{
			name: 'root',
			description: 'The builder store used to create the toolbar root.',
		},
		{
			name: 'button',
			description: 'The builder store used to create the toolbar button.',
		},
		{
			name: 'link',
			description: 'The builder store used to create the toolbar link.',
		},
		{
			name: 'separator',
			description: 'The builder store used to create the toolbar separator.',
		},
	]),
	builders: [
		{
			name: 'createToolbarGroup',
			description: 'A builder function that creates a toolbar group.',
			link: '#createtoolbargroup',
		},
	],
	options: propsToOptions('toolbar', OPTION_PROPS),
};

const root: APISchema = {
	title: 'root',
	description: 'The root toolbar element.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-toolbar',
			value: ATTRS.MELT('toolbar'),
		},
	],
};

const button: APISchema = {
	title: 'button',
	description: 'The toolbar button element.',
	dataAttributes: [
		{
			name: 'data-melt-toolbar-button',
			value: ATTRS.MELT('toolbar button'),
		},
	],
};

const link: APISchema = {
	title: 'link',
	description: 'The toolbar link element.',
	dataAttributes: [
		{
			name: 'data-melt-toolbar-link',
			value: ATTRS.MELT('toolbar link'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'The toolbar separator element.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-toolbar-separator',
			value: ATTRS.MELT('toolbar separator'),
		},
	],
};

const GROUP_OPTION_PROPS = [
	PROPS.DISABLED,
	{
		name: 'type',
		type: ["'single'", "'multiple'"],
		default: "'single'",
		description:
			'The type of toolbar group. A `single` group can only have one item selected at a time. A `multiple` group can have multiple items selected at a time.',
	},
];

const groupBuilder: APISchema = {
	title: 'createToolbarGroup',
	description: DESCRIPTIONS.BUILDER('toolbar group'),
	props: genProps('toolbar group', [
		...GROUP_OPTION_PROPS,
		{
			name: 'defaultValue',
			type: ['string', 'string[]', 'undefined'],
			description: 'The value of the default selected item(s).',
		},
		{
			name: 'value',
			type: 'Writable<string | string[] | undefined>',
			description: 'A writable store that can be used to update the toolbar group value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string | string[] | undefined>',
			description: 'A callback function that is called when the toolbar group value changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	]),
	elements: genElements('toolbar group', [
		{
			name: 'root',
			description: 'The builder store used to create the toolbar group root.',
		},
		{
			name: 'item',
			description: 'The builder store used to create the toolbar group item.',
		},
	]),
	states: [
		{
			name: 'value',
			type: 'Readable<string | string[] | undefined>',
			description: 'A derived store that returns the current value of the toolbar group.',
		},
	],
	helpers: [
		{
			name: 'isPressed',
			type: 'Readable<(itemValue: string) => boolean>',
			description:
				'A derived store that returns a function that can be used to check if an item is pressed.',
		},
	],
	options: propsToOptions('toolbar group', GROUP_OPTION_PROPS),
};

const group: APISchema = {
	title: 'group',
	description: 'The root toolbar element for a toolbar group.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-toolbar-group',
			value: ATTRS.MELT('toolbar group'),
		},
	],
};

const groupItem: APISchema = {
	title: 'groupItem',
	description: 'A an item within a toolbar group.',
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
			name: 'data-melt-toolbar-item',
			value: ATTRS.MELT('toolbar item'),
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			name: 'data-state',
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

const schemas = [builder, root, button, link, separator, groupBuilder, group, groupItem];

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Horizontal or vertical orientation',
];

export const toolbarData: BuilderData = {
	schemas,
	features,
	keyboard,
};
