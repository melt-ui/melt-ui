import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateTooltipArgs',
	description: 'Configuration options for the `createTooltip` builder.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: 8,
		},
		{
			label: 'open',
			type: 'boolean',
			default: false,
		},
		{
			label: 'closeOnPointerDown',
			type: 'boolean',
			default: true,
		},
		{
			label: 'openDelay',
			type: 'number',
			default: 1000,
		},
		{
			label: 'closeDelay',
			type: 'number',
			default: 500,
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The tooltip trigger element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ["'open'", "'closed'"],
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'The tooltip arrow element.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: 'true',
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Tab',
			description: 'Opens/closes the tooltip without delay.',
		},
		{
			key: 'Space',
			description: 'If open, closes the tooltip without delay.',
		},
		{
			key: 'Enter',
			description: 'If open, closes the tooltip without delay.',
		},
		{
			key: 'Escape',
			description: 'If open, closes the tooltip without delay.',
		},
	],
};

export const schemas = {
	builder,
	trigger,
	arrow,
	keyboard,
};
