import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createPopover',
	description: 'The builder function used to create a popover component.',
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: 'position: "bottom"',
			description: DESCRIPTIONS.FLOATING_CONFIG,
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			label: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Whether the popover is open by default or not.',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The button(s) which open/close the popover.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-popover-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			label: 'data-melt-popover-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const close: APISchema = {
	title: 'close',
	description: 'The button(s) which close the popover.',
	dataAttributes: [
		{
			label: 'data-melt-popover-close',
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

const schemas = {
	builder,
	trigger,
	arrow,
	close,
	keyboard,
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
