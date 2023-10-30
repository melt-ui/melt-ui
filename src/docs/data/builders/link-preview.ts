import { ATTRS, PROPS } from '$docs/constants.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { linkPreviewEvents } from '$lib/builders/link-preview/events.js';
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
		description: 'The delay in milliseconds before the link preview opens.',
	},
	{
		name: 'closeDelay',
		type: 'number',
		default: '300',
		description: 'The delay in milliseconds before the link preview closes.',
	},
	PROPS.POSITIONING({ default: "placement: 'bottom'" }),
	PROPS.ARROW_SIZE,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.FORCE_VISIBLE,
	PROPS.PORTAL,
];

const BUILDER_NAME = 'link preview';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createLinkPreview',
	props: [
		...OPTION_PROPS,
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
		{
			name: 'ids',
			type: 'Record<"content" | "trigger", string>',
			description: 'Override the internally generated ids for the elements.',
		},
	],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the link preview trigger.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the link preview content.',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the link preview arrow.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store with the open state of the link preview.',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
	description: 'The link preview trigger element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-link-preview-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
	events: linkPreviewEvents['trigger'],
});

const content = elementSchema('content', {
	description: 'The content displayed in the linkpreview',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-link-preview-content',
			value: ATTRS.MELT('content'),
		},
	],
	events: linkPreviewEvents['content'],
});

const arrow = getMenuArrowSchema(BUILDER_NAME);

const schemas = [builder, trigger, content, arrow];

const features = [
	'Controlled or uncontrolled',
	'Ignored by screen readers',
	'Custom open and close delay support',
	'Positioning and alignment customization',
];

export const linkPreviewData: BuilderData = {
	schemas,
	features,
};
