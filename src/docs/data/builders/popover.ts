import { ATTRS, DESCRIPTIONS, KBD, LONG_TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createPopover',
	description: DESCRIPTIONS.BUILDER('popover'),
	props: [
		{
			name: 'positioning',
			type: 'FloatingConfig',
			default: 'position: "bottom"',
			description: DESCRIPTIONS.FLOATING_CONFIG,
			longType: LONG_TYPES.FLOATING_CONFIG,
		},
		{
			name: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			name: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Whether the popover is open by default or not.',
		},
	],
	returnedProps: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls the open state of the popover.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the popover trigger.',
			link: '#trigger',
		},
		{
			name: 'content',
			description: 'The builder store used to create the popover content.',
			link: '#content',
		},
		{
			name: 'close',
			description: 'The builder store used to create the popover close button.',
			link: '#close',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the popover arrow.',
			link: '#arrow',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The button(s) which open/close the popover.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-popover-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The popover content.',
	dataAttributes: [
		{
			name: 'data-melt-popover-content',
			value: ATTRS.MELT('content'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element.',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-popover-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const close: APISchema = {
	title: 'close',
	description: 'The button(s) which close the popover.',
	dataAttributes: [
		{
			name: 'data-melt-popover-close',
			value: ATTRS.MELT('close'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.TAB,
		behavior:
			'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior:
			'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the popover and moves focus to the trigger element.',
	},
];

const schemas = [builder, trigger, content, close, arrow];

const features = [
	'Full keyboard navigation',
	'Customize positioning of popover',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Supports an optional arrow component',
];

export const popoverData: BuilderData = {
	schemas,
	features,
	keyboard,
};
