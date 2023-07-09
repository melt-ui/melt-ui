import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'CreatePopoverArgs',
	description: 'The configuration object passed to the `createPopover` builder function.',
	props: [
		{
			label: 'checked',
			type: ['boolean', '"indeterminate"'],
			default: 'false',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'required',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'name',
			type: 'string',
		},
		{
			label: 'value',
			type: 'string',
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The button(s) which open/close the popover.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ['"open"', '"closed"'],
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'The optional arrow element.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ['true'],
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'Toggles the popover.',
	},
	{
		key: 'Enter',
		behavior: 'Toggles the popover.',
	},
	{
		key: 'Tab',
		behavior:
			'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: 'Shift + Tab',
		behavior:
			'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: 'Esc',
		behavior: 'Closes the popover and moves focus to the trigger element.',
	},
];

const schemas = {
	keyboard,
	builder,
	trigger,
	arrow,
};

const features = [
	'Full keyboard navigation',
	'Customize positioning of popover',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Supports an optional arrow component',
];

export const popoverData = {
	schemas,
	features,
};
