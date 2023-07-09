import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createDialog',
	description: 'The configuration object passed to the `createDialog` builder function.',
	props: [
		{
			label: 'role',
			type: ["'dialog'", "'alertdialog'"],
			default: "'dialog'",
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'closeOnEscape',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior: 'Opens/closes the dialog.',
	},
	{
		key: 'Enter',
		behavior: 'Opens/closes the dialog.',
	},
	{
		key: 'Tab',
		behavior: 'Moves focus to the next focusable element within the dialog.',
	},
	{
		key: 'Shift + Tab',
		behavior: 'Moves focus to the previous focusable element within the dialog.',
	},
	{
		key: 'Esc',
		behavior: 'Closes the dialog and moves focus to the trigger element.',
	},
];

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
