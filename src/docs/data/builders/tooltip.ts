import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createTooltip',
	description: 'The configuration object passed to the `createTooltip` builder function.',
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
		},
		{
			label: 'open',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'closeOnPointerDown',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'openDelay',
			type: 'number',
			default: '1000',
		},
		{
			label: 'closeDelay',
			type: 'number',
			default: '500',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The tooltip trigger element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: "`'open' | 'closed'`",
		},
		{
			label: 'data-melt-tooltip-trigger',
			value: 'Present on the trigger element',
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The tooltip arrow element.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: "`'true'`",
		},
		{
			label: 'data-melt-tooltip-arrow',
			value: 'Present on the arrow element',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Tab',
		behavior: 'Opens/closes the tooltip without delay.',
	},
	{
		key: 'Space',
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: 'Enter',
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: 'Escape',
		behavior: 'If open, closes the tooltip without delay.',
	},
];

const schemas = {
	builder,
	trigger,
	arrow,
	keyboard,
};

const features = [
	'Opens when the trigger is focused or hovered',
	'Closes when the trigger is activated or with escape',
	'Custom delay for opening and closing',
	'Supports custom positioning',
];

export const tooltipData = {
	schemas,
	features,
};
