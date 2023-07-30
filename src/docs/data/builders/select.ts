import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createSelect',
	description: DESCRIPTIONS.BUILDER('select'),
	props: [
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is required.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is disabled.',
		},
		{
			name: 'valueLabel',
			type: 'string',
			description: 'The initial value label of the select.',
		},
		{
			name: 'value',
			type: 'unknown',
			description: 'The initial value of the select.',
		},
		{
			name: 'name',
			type: 'string',
			description: 'The name of the select.',
		},
		{
			name: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.PREVENT_SCROLL('select'),
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'false',
			description: DESCRIPTIONS.LOOP,
		},
		{
			name: 'multiple',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the select is a multiple select.',
		},
	],
	returnedProps: [
		{
			name: 'options',
			type: 'Writable<CreateSelectProps>',
			description: 'A writable store that can be used to update the select props.',
		},
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that can be used to update the select open state.',
		},
		{
			name: 'isSelected',
			type: 'Readable<(value: unknown) => boolean>',
			description: 'A derived store that returns whether or not the given value is selected.',
		},
		{
			name: 'value',
			type: 'Writable<unknown>',
			description: 'A writable store that can be used to get or update or the select value.',
		},
		{
			name: 'valueLabel',
			type: 'Writable<string | number | null>',
			description: 'A writable store that can be used to get or update the select label.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the select trigger.',
			link: '#trigger',
		},
		{
			name: 'menu',
			description: 'The builder store used to create the select menu.',
			link: '#menu',
		},
		{
			name: 'option',
			description: 'The builder store used to create the select options.',
			link: '#option',
		},
		{
			name: 'input',
			description: 'The builder store used to create the select input.',
			link: '#input',
		},
		{
			name: 'label',
			description: 'The builder store used to create the select label.',
			link: '#label',
		},

		{
			name: 'separator',
			description: 'The builder store used to create the select separator.',
			link: '#separator',
		},
		{
			name: 'group',
			description: 'The builder store used to create the select group.',
			link: '#group',
		},
		{
			name: 'groupLabel',
			description: 'The builder store used to create the select group label.',
			link: '#grouplabel',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the select arrow.',
			link: '#arrow',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens/closes the select.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('select'),
		},
		{
			name: 'data-melt-select-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const menu: APISchema = {
	title: 'menu',
	description: 'The menu element',
	dataAttributes: [
		{
			name: 'data-melt-select-menu',
			value: ATTRS.MELT('menu'),
		},
	],
};

const option: APISchema = {
	title: 'option',
	description: 'The option elements',
	props: [
		{
			name: 'label',
			type: 'string',
			description: 'The label of the option.',
		},
		{
			name: 'value',
			type: 'unknown',
			description: 'The value of the option.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the option is disabled.',
		},
	],
};

const input: APISchema = {
	title: 'input',
	description: 'The hidden input element. Used for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-select-input',
			value: ATTRS.MELT('input'),
		},
	],
};

const label: APISchema = {
	title: 'label',
	description: 'The label element',
	dataAttributes: [
		{
			name: 'data-melt-select-label',
			value: ATTRS.MELT('label'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-select-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'An optional separator element',
	dataAttributes: [
		{
			name: 'data-melt-select-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const group: APISchema = {
	title: 'group',
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			name: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-select-group',
			value: ATTRS.MELT('group'),
		},
	],
};

const groupLabel: APISchema = {
	title: 'groupLabel',
	description: 'A function which takes in a unique key to group options together.',
	props: [
		{
			name: 'key',
			type: 'string',
			description: 'A unique key for the group.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-select-group-label',
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

const schemas = [builder, trigger, label, menu, option, group, groupLabel, input, separator, arrow];

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Typeahead support',
	'Optional arrow component',
	'Custom positioning',
];

export const selectData: BuilderData = {
	schemas,
	features,
	keyboard,
};
