import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateRadioGroupArgs',
	description: 'Configuration options for the `createRadioGroup` builder.',
	args: [
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'loop',
			type: 'boolean',
			default: true,
		},
		{
			label: 'required',
			type: 'boolean',
			default: false,
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
	title: 'Root',
	description: 'The radio group component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
		{
			label: 'data-melt-part',
			value: '`radio-group`',
		},
	],
};

const item: APISchema = {
	title: 'Item',
	description: 'The radio group item components.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
	],
	dataAttributes: [
		{
			label: 'data-disabled',
			value: 'Present if the item is disabled.',
		},
		{
			label: 'data-state',
			value: ['"checked"', '"unchecked"'],
		},
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
		{
			label: 'data-melt-part',
			value: '`radio-group-item`',
		},
	],
};

export const schemas = {
	builder,
	root,
	item,
};
