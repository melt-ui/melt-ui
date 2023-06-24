import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreatePopoverArgs',
	description: 'Configuration options for the `createPopover` builder.',
	args: [
		{
			label: 'checked',
			type: ['boolean', '"indeterminate"'],
			default: false,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: false,
		},
		{
			label: 'required',
			type: 'boolean',
			default: false,
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

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'Toggles the popover.',
		},
		{
			key: 'Enter',
			description: 'Toggles the popover.',
		},
		{
			key: 'Tab',
			description:
				'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
		},
		{
			key: 'Shift + Tab',
			description:
				'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
		},
		{
			key: 'Esc',
			description: 'Closes the popover and moves focus to the trigger element.',
		},
	],
};

export const schemas = {
	keyboard,
	builder,
	trigger,
	arrow,
};
