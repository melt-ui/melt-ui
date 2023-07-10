import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createHoverCard',
	description: DESCRIPTIONS.BUILDER('hover card'),
	props: [
		{
			name: 'defaultOpen',
			type: 'boolean',
			default: 'false',
			description: 'Whether the hover card is open by default.',
		},
		{
			name: 'positioning',
			type: 'FloatingConfig',
			default: 'placement: "bottom"',
			description: DESCRIPTIONS.FLOATING_CONFIG,
		},
		{
			name: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			name: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.CLOSE_ON_CLICK_OUTSIDE('hover card'),
		},
		{
			name: 'openDelay',
			type: 'number',
			default: '700',
			description: 'The delay in milliseconds before the hover card opens.',
		},
		{
			name: 'closeDelay',
			type: 'number',
			default: '300',
			description: 'The delay in milliseconds before the hover card closes.',
		},
	],
	returnedProps: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls the open state of the hover card.',
		},
		{
			name: 'options',
			type: 'Writable<CreateHoverCardProps>',
			description: 'A writable store that controls the options of the hover card.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the hover card trigger.',
			link: '#trigger',
		},
		{
			name: 'content',
			description: 'The builder store used to create the hover card content.',
			link: '#content',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the hover card arrow.',
			link: '#arrow',
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The hover card trigger element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-hover-card-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The content displayed in the hovercard',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-hover-card-content',
			value: ATTRS.MELT('content'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'The optional arrow element that points to the trigger.',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-hover-card-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const schemas = [builder, trigger, content, arrow];

const features = [
	'Controlled or uncontrolled',
	'Ignored by screen readers',
	'Custom open and close delay support',
	'Positioning and alignment customization',
];

export const hoverCardData: BuilderData = {
	schemas,
	features,
};
