import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createToggleGroup',
	description: 'The configuration object passed to the `createToggleGroup` builder function.',
	props: [
		{
			label: 'type',
			type: ["'single'", "'multiple'"],
			default: "'single'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'value',
			type: ['string', 'string[]', 'null'],
			default: 'null',
		},
		{
			label: 'rovingFocus',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'orientation',
			type: ["'horizontal'", "'vertical'"],
			default: "'horizontal'",
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
	],
};

const toggleGroup: APISchema = {
	title: 'toggleGroup',
	description: 'The root toggle group element.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-toggle-group',
			value: 'Present on the toggle group element',
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'The toggle group item element.',
	props: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-toggle-group-item',
			value: 'Present on the toggle group item element',
		},
		{
			label: 'data-state',
			value: "`'on' | 'off'`",
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Tab',
		behavior: 'Moves focus to either the pressed item or the first item in the group.',
	},
	{
		key: 'Space',
		behavior: 'Activates/deactivates the item.',
	},
	{
		key: 'Enter',
		behavior: 'Activates/deactivates the item.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Moves focus to the next item in the group.',
	},
	{
		key: 'ArrowRight',
		behavior: 'Moves focus to the next item in the group.',
	},
	{
		key: 'ArrowUp',
		behavior: 'Moves focus to the previous item in the group.',
	},
	{
		key: 'ArrowLeft',
		behavior: 'Moves focus to the previous item in the group.',
	},
	{
		key: 'Home',
		behavior: 'Moves focus to the first item in the group.',
	},
	{
		key: 'End',
		behavior: 'Moves focus to the last item in the group.',
	},
];

const schemas = {
	builder,
	toggleGroup,
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
