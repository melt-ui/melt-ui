import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTooltip',
	description: DESCRIPTIONS.BUILDER('tooltip'),
	props: [
		{
			name: 'positioning',
			type: 'FloatingConfig',
			default: "position: 'top'",
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
			description: 'Whether the tooltip is open or not.',
		},
		{
			name: 'closeOnPointerDown',
			type: 'boolean',
			default: 'true',
			description: 'Whether the tooltip closes when the pointer is down.',
		},
		{
			name: 'openDelay',
			type: 'number',
			default: '1000',
			description: 'The delay in milliseconds before the tooltip opens after a pointer over event.',
		},
		{
			name: 'closeDelay',
			type: 'number',
			default: '500',
			description:
				'The delay in milliseconds before the tooltip closes after a pointer leave event.',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The tooltip trigger element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-tooltip-trigger',
			value: ATTRS.MELT('tooltip trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The tooltip content element.',
	dataAttributes: [
		{
			name: 'data-melt-tooltip-content',
			value: ATTRS.MELT('tooltip content'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The tooltip arrow element.',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-tooltip-arrow',
			value: ATTRS.MELT('tooltip arrow'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Opens/closes the tooltip without delay.',
	},
	{
		key: KBD.SPACE,
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: KBD.ENTER,
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'If open, closes the tooltip without delay.',
	},
];

const schemas = [builder, trigger, content, arrow];

const features: BuilderData['features'] = [
	'Opens when the trigger is focused or hovered',
	'Closes when the trigger is activated or with escape',
	'Custom delay for opening and closing',
	'Supports custom positioning',
];

export const tooltipData: BuilderData = {
	schemas,
	features,
	keyboard,
};
