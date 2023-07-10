import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createDialog',
	description: DESCRIPTIONS.BUILDER('dialog'),
	props: [
		{
			name: 'role',
			type: ["'dialog'", "'alertdialog'"],
			default: "'dialog'",
			description: 'The `role` attribute of the dialog element.',
		},
		{
			name: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.PREVENT_SCROLL('dialog'),
		},
		{
			name: 'closeOnEscape',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.CLOSE_ON_ESCAPE('dialog'),
		},
		{
			name: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.CLOSE_ON_CLICK_OUTSIDE('dialog'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which triggers the dialog to open when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const overlay: APISchema = {
	title: 'overlay',
	description: 'The overlay element which covers the page when the dialog is open.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-dialog-overlay',
			value: ATTRS.MELT('overlay'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The element displayed within the dialog when it is open.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-dialog-content',
			value: ATTRS.MELT('content'),
		},
	],
};

const title: APISchema = {
	title: 'title',
	description: 'The title of the dialog. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-title',
			value: ATTRS.MELT('title'),
		},
	],
};

const description: APISchema = {
	title: 'description',
	description: 'The description of the dialog. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-description',
			value: ATTRS.MELT('description'),
		},
	],
};

const close: APISchema = {
	title: 'close',
	description: 'The element which closes the dialog when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-close',
			value: ATTRS.MELT('close'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Opens/closes the dialog.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Opens/closes the dialog.',
	},
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the next focusable element within the dialog.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior: 'Moves focus to the previous focusable element within the dialog.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the dialog and moves focus to the trigger element.',
	},
];

const schemas = [builder, trigger, overlay, content, close, title, description];
const features = [
	'Fully managed focus',
	'Can be controlled or uncontrolled',
	'Esc closes the component automaticlaly',
];

export const dialogData: BuilderData = {
	schemas,
	features,
	keyboard,
};
