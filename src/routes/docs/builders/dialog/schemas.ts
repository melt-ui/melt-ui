import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateDialogArgs',
	description: 'The object you pass into createAccordion. Optional.',
	args: [
		{
			label: 'role',
			type: "'dialog' | 'alert-dialog'",
			default: "'dialog'",
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: true,
		},
		{
			label: 'closeOnEscape',
			type: 'boolean',
			default: true,
		},
		{
			label: 'closeOnOutsideClick',
			type: 'boolean',
			default: true,
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'Opens/closes the dialog.',
		},
		{
			key: 'Enter',
			description: 'Opens/closes the dialog.',
		},
		{
			key: 'Tab',
			description: 'Moves focus to the next focusable element within the dialog.',
		},
		{
			key: 'Shift + Tab',
			description: 'Moves focus to the previous focusable element within the dialog.',
		},
		{
			key: 'Esc',
			description: 'Closes the dialog and moves focus to the trigger element.',
		},
	],
};

export const schemas = {
	builder,
	keyboard,
};
