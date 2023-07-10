import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
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

const schemas = [builder, trigger, close, arrow];

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
