import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createHoverCard',
	description: 'The builder function used to create a hover card component.',
	props: [
		{
			label: 'defaultOpen',
			type: 'boolean',
			default: 'false',
			description: 'Whether the hover card is open by default.',
		},
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: 'placement: "bottom"',
			description: DESCRIPTIONS.FLOATING_CONFIG,
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			label: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.CLOSE_ON_CLICK_OUTSIDE('hover card'),
		},
		{
			label: 'openDelay',
			type: 'number',
			default: '700',
			description: 'The delay in milliseconds before the hover card opens.',
		},
		{
			label: 'closeDelay',
			type: 'number',
			default: '300',
			description: 'The delay in milliseconds before the hover card closes.',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The hover card trigger element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-hover-card-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The content displayed in the hovercard',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-hover-card-content',
			value: ATTRS.MELT('content'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element that points to the trigger.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			label: 'data-melt-hover-card-arrow',
			value: ATTRS.MELT('arrow'),
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
