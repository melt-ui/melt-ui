import { ATTRS, PROPS } from '$docs/constants.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { hoverCardEvents } from '$lib/builders/hover-card/events.js';
import type { BuilderData } from './index.js';
import { getMenuArrowSchema } from './menu.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
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
	PROPS.POSITIONING({ default: "placement: 'bottom'" }),
	PROPS.ARROW_SIZE,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.FORCE_VISIBLE,
	PROPS.PORTAL,
];

const BUILDER_NAME = 'hover card';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createHoverCard',
	props: [...OPTION_PROPS, PROPS.DEFAULT_OPEN, PROPS.OPEN, PROPS.ON_OPEN_CHANGE],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the hover card trigger.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the hover card content.',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the hover card arrow.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store with the open state of the hover card.',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
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
	events: hoverCardEvents['trigger'],
});

const content = elementSchema('content', {
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
	events: hoverCardEvents['content'],
});

const arrow = getMenuArrowSchema(BUILDER_NAME);

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
