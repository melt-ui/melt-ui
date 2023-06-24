import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreatePopover',
	description: 'Configuration options for the `createPopover` function.',
	args: [
		{
			label: 'checked',
			type: 'boolean | "indeterminate"',
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
};
