import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateDialogArgs',
	description: 'The configuration object passed to the `createDialog` builder function.',
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

const schemas = {
	builder,
	keyboard,
};
const features = [
	'Fully managed focus',
	'Can be controlled or uncontrolled',
	'Esc closes the component automaticlaly',
];

export const dialogData = {
	schemas,
	features,
};
