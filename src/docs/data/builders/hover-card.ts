import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateHoverCardArgs',
	description: 'The configuration object passed to the `createHoverCard` builder function.',
	args: [
		{
			label: 'defaultOpen',
			type: 'boolean',
			default: false,
		},
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: 'placement: "bottom"',
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
			label: 'closeOnOutsideClick',
			type: 'boolean',
			default: true,
		},
		{
			label: 'openDelay',
			type: 'number',
			default: 700,
		},
		{
			label: 'closeDelay',
			type: 'number',
			default: 300,
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The hover card trigger element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ["'open'", "'closed'"],
		},
		{
			label: 'data-melt-hover-card-trigger',
			value: '',
		},
	],
};

const content: APISchema = {
	title: 'Content',
	description: 'The content displayed in the hovercard',
	dataAttributes: [
		{
			label: 'data-melt-hover-card-content',
			value: '',
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'The optional arrow element that points to the trigger.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: 'true',
		},
		{
			label: 'data-melt-hover-card-arrow',
			value: '',
		},
	],
};

const schemas = {
	builder,
	trigger,
	arrow,
	content,
};

const features = [
	'Controlled or uncontrolled',
	'Ignored by screen readers',
	'Custom open and close delay support',
	'Positioning and alignment customization',
];

export const hoverCardData = {
	schemas,
	features,
};
