import { ATTRS, DESCRIPTIONS, PROPS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';
import { getMenuArrowSchema } from './menu';

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

const builder: APISchema = {
	title: 'createHoverCard',
	description: DESCRIPTIONS.BUILDER('hover card'),
	props: genProps('hover card', [
		...OPTION_PROPS,
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
	]),
	elements: genElements('hover card', [
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
	]),
	states: [
		{
			name: 'open',
			type: 'Readable<boolean>',
			description: 'A readable store with the open state of the hover card.',
		},
	],
	options: propsToOptions('hover card', []),
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

const arrow: APISchema = getMenuArrowSchema('hover card');

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
