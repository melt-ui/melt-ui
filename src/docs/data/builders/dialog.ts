import { ATTRS, KBD, PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { dialogIdParts } from '$lib/index.js';
import { dialogEvents } from '$lib/builders/dialog/events.js';
import type { BuilderData } from './index.js';

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
	PROPS.OPEN_FOCUS,
	PROPS.CLOSE_FOCUS,
];

const BUILDER_NAME = 'dialog';

const builder = builderSchema(BUILDER_NAME, {
	ids: dialogIdParts,
	title: 'createDialog',
	props: [...OPTION_PROPS, PROPS.DEFAULT_OPEN, PROPS.OPEN, PROPS.ON_OPEN_CHANGE],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the dialog trigger.',
		},
		{
			name: 'portalled',
			description: 'The builder store used to create the portalled dialog container.',
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
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store with the open state of the dialog.',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
	description: 'The element which triggers the dialog to open when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
	events: dialogEvents['trigger'],
});

const portalled = elementSchema('portalled', {
	description:
		'The element that will be portalled (or moved) to a different location in the DOM based on the `portal` prop value.',
	dataAttributes: [
		{
			name: 'data-portal',
			value: ATTRS.MELT('portalled'),
		},
		{
			name: 'data-melt-dialog-portalled',
			value: ATTRS.MELT('portalled'),
		},
	],
});

const overlay = elementSchema('overlay', {
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
});

const content = elementSchema('content', {
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
});

const title = elementSchema('title', {
	description: 'The title of the dialog. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-title',
			value: ATTRS.MELT('title'),
		},
	],
});

const description = elementSchema('description', {
	description: 'The description of the dialog. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-description',
			value: ATTRS.MELT('description'),
		},
	],
});

const close = elementSchema('close', {
	description: 'The element which closes the dialog when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-dialog-close',
			value: ATTRS.MELT('close'),
		},
	],
	events: dialogEvents['close'],
});

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

const schemas = [builder, trigger, portalled, overlay, content, close, title, description];
const features = [
	'Fully managed focus',
	'Can be controlled or uncontrolled',
	'Esc closes the component automatically',
];

export const dialogData: BuilderData = {
	schemas,
	features,
	keyboard,
};
