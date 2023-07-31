import { ATTRS, DESCRIPTIONS, KBD, PROPS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'role',
		type: ["'dialog'", "'alertdialog'"],
		default: "'dialog'",
		description: 'The `role` attribute of the dialog element.',
	},
	PROPS.PREVENT_SCROLL,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.PORTAL,
	PROPS.FORCE_VISIBLE,
];

const builder: APISchema = {
	title: 'createDialog',
	description: DESCRIPTIONS.BUILDER('dialog'),
	props: genProps('dialog', [
		...OPTION_PROPS,
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
	]),
	elements: genElements('dialog', [
		{
			name: 'trigger',
			description: 'The builder store used to create the dialog trigger.',
		},
		{
			name: 'overlay',
			description: 'The builder store used to create the dialog overlay.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the dialog content.',
		},
		{
			name: 'close',
			description: 'The builder store used to create the dialog close button.',
		},
		{
			name: 'title',
			description: 'The builder store used to create the dialog title.',
		},
		{
			name: 'description',
			description: 'The builder store used to create the dialog description.',
		},
	]),
	states: [
		{
			name: 'open',
			type: 'Readable<boolean>',
			description: 'A readable store with the open state of the dialog.',
		},
	],
	options: propsToOptions('dialog', OPTION_PROPS),
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
