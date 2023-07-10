import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSelect',
	description: 'The builder function used to create a select component.',
	props: [
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is required.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is disabled.',
		},
		{
			label: 'label',
			type: 'string',
			description: 'The label of the select.',
		},
		{
			label: 'value',
			type: 'unknown',
			description: 'The value of the select.',
		},
		{
			label: 'name',
			type: 'string',
			description: 'The name of the select.',
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.PREVENT_SCROLL('select'),
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'false',
			description: DESCRIPTIONS.LOOP,
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens/closes the select.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('select'),
		},
		{
			label: 'data-melt-select-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const option: APISchema = {
	title: 'option',
	description: 'The option elements',
	props: [
		{
			label: 'label',
			type: 'string',
			description: 'The label of the option.',
		},
		{
			label: 'value',
			type: 'unknown',
			description: 'The value of the option.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the option is disabled.',
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			label: 'data-melt-select-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'An optional separator element',
	dataAttributes: [
		{
			label: 'data-melt-select-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const group: APISchema = {
	title: 'group',
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			label: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			label: 'data-melt-select-group',
			value: ATTRS.MELT('group'),
		},
	],
};

const groupLabel: APISchema = {
	title: 'groupLabel',
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			label: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			label: 'data-melt-select-group-label',
			value: ATTRS.MELT('group-label'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: KBD.ENTER,
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option.',
	},
	{
		key: KBD.ARROW_UP,
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the select and moves focus to the `trigger`.',
	},
];

const schemas = {
	builder,
	trigger,
	option,
	arrow,
	group,
	groupLabel,
	separator,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Typeahead support',
	'Optional arrow component',
	'Custom positioning',
];

export const selectData = {
	schemas,
	features,
};
