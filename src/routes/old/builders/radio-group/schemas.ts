import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateRadioGroupArgs',
	description: 'The configuration object passed to the `createRadioGroup` builder function.',
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

const keyboard = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Tab',
			description: 'Moves focus to either the checked radio item or the first radio item.',
		},
		{
			key: 'Space',
			description: 'When focused on an unchecked item, checks it.',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to & checks the next radio item',
		},
		{
			key: 'ArrowRight',
			description: 'Moves focus to & checks the next radio item',
		},
		{
			key: 'ArrowUp',
			description: 'Moves focus to & checks the previous radio item',
		},
		{
			key: 'ArrowLeft',
			description: 'Moves focus to & checks the previous radio item',
		},
	],
};

export const schemas = {
	builder,
	root,
	item,
	keyboard,
};
