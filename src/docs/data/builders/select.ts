import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSelect',
	description: 'The configuration object passed to the `createSelect` builder function.',
	props: [
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'label',
			type: 'string',
		},
		{
			label: 'value',
			type: 'unknown',
		},
		{
			label: 'name',
			type: 'string',
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'false',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens/closes the select.',
	dataAttributes: [
		{
			label: 'data-state',
			value: "`'open' | 'closed'`",
		},
		{
			label: 'data-disabled',
			value: 'Present if the `select` element is disabled.',
		},
		{
			label: 'data-melt-select-trigger',
			value: 'Present on the trigger element.',
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
		},
		{
			label: 'value',
			type: 'unknown',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: "`'true'`",
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'An optional separator element',
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
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: 'Enter',
		behavior:
			'When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option.',
	},
	{
		key: 'ArrowDown',
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option.',
	},
	{
		key: 'ArrowUp',
		behavior:
			'When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option.',
	},
	{
		key: 'Esc',
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
