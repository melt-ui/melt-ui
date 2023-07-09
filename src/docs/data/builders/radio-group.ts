import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createRadioGroup',
	description: 'The configuration object passed to the `createRadioGroup` builder function.',
	props: [
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'orientation',
			type: ['"horizontal"', '"vertical"'],
			default: '"vertical"',
		},
		{
			label: 'value',
			type: 'string',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The radio group component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-radio-group',
			value: 'Present on the root element.',
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'The radio group item components.',
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
			label: 'data-disabled',
			value: 'Present if the item is disabled.',
		},
		{
			label: 'data-state',
			value: "`'checked' | 'unchecked'`",
		},
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-radio-group-item',
			value: 'Present on the item elements.',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Tab',
		behavior: 'Moves focus to either the checked radio item or the first radio item.',
	},
	{
		key: 'Space',
		behavior: 'When focused on an unchecked item, checks it.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Moves focus to & checks the next radio item',
	},
	{
		key: 'ArrowRight',
		behavior: 'Moves focus to & checks the next radio item',
	},
	{
		key: 'ArrowUp',
		behavior: 'Moves focus to & checks the previous radio item',
	},
	{
		key: 'ArrowLeft',
		behavior: 'Moves focus to & checks the previous radio item',
	},
];

const schemas = {
	builder,
	root,
	item,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Supports horizontal and vertical orientation',
];

export const radioGroupData = {
	schemas,
	features,
};
