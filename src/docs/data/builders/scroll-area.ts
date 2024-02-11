import { ATTRS } from '$docs/constants.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';
import { scrollAreaIdParts } from '$lib/builders/scroll-area/create.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'type',
		type: ['"auto"', '"always"', '"scroll"', '"hover"'],
		default: '"hover"',
		description: 'Determins when the scrollbar should be visible.',
	},
	{
		name: 'hideDelay',
		type: 'number',
		default: '600',
		description:
			'When the `type` is `"scroll"` or `"hover"`, this determines how long the scrollbar should be visible after the user either stops scrolling or stops hovering over the scroll area.',
	},
	{
		name: 'dir',
		type: ['ltr', 'rtl'],
		default: 'ltr',
		description: 'The reading direction of the scroll area.',
	},
];

const BUILDER_NAME = 'scroll area';

const builder = builderSchema(BUILDER_NAME, {
	ids: scrollAreaIdParts,
	title: 'createScrollArea',
	props: OPTION_PROPS,
	elements: [
		{
			name: 'root',
			description: 'The container that wraps all parts of the scroll area.',
		},
		{
			name: 'viewport',
			description:
				'A container that wraps the scrollable content and is used to calculate the scrollbar size.',
		},
		{
			name: 'content',
			description: 'The scrollable content.',
		},
		{
			name: 'scrollbarX',
			description: 'The track of the horizontal scrollbar.',
		},
		{
			name: 'thumbX',
			description: 'The thumb of the horizontal scrollbar.',
		},
		{
			name: 'scrollbarY',
			description: 'The track of the vertical scrollbar.',
		},
		{
			name: 'thumbY',
			description: 'The thumb of the vertical scrollbar.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The container that wraps all parts of the scroll area.',
	dataAttributes: [
		{
			name: 'data-melt-scroll-area',
			value: ATTRS.MELT('scroll area root'),
		},
	],
});

const viewport = elementSchema('viewport', {
	description:
		'The container that wraps the scrollable content and is used to calculate the scrollbar size.',
	dataAttributes: [
		{
			name: 'data-melt-scroll-area-viewport',
			value: ATTRS.MELT('scroll area viewport'),
		},
	],
});

const content = elementSchema('content', {
	description: 'The scrollable content. This is the element that will be scrolled.',
	dataAttributes: [
		{
			name: 'data-melt-scroll-area-content',
			value: ATTRS.MELT('scroll area content'),
		},
	],
});

const scrollbarX = elementSchema('scrollbarX', {
	description: 'The track of the horizontal scrollbar.',
	dataAttributes: [
		{
			name: 'data-state',
			value: '`"visible" | "hidden"`',
		},
		{
			name: 'data-melt-scroll-area-scrollbar',
			value: ATTRS.MELT('scroll area scrollbar'),
		},
	],
	events: ['pointerdown', 'pointerup', 'pointermove'],
});
const thumbX = elementSchema('thumbX', {
	description: 'The thumb of the horizontal scrollbar.',
	dataAttributes: [
		{
			name: 'data-state',
			value: '`"visible" | "hidden"`',
		},
		{
			name: 'data-melt-scroll-area-thumb',
			value: ATTRS.MELT('scroll area thumb'),
		},
	],
	events: ['pointerdown', 'pointerup'],
});

const scrollbarY = elementSchema('scrollbarY', {
	description: 'The track of the vertical scrollbar.',
	dataAttributes: [
		{
			name: 'data-state',
			value: '`"visible" | "hidden"`',
		},
		{
			name: 'data-melt-scroll-area-scrollbar',
			value: ATTRS.MELT('scroll area scrollbar'),
		},
	],
	events: ['pointerdown', 'pointerup', 'pointermove'],
});

const thumbY = elementSchema('thumbY', {
	description: 'The thumb of the vertical scrollbar.',
	dataAttributes: [
		{
			name: 'data-state',
			value: '`"visible" | "hidden"`',
		},
		{
			name: 'data-melt-scroll-area-thumb',
			value: ATTRS.MELT('scroll area thumb'),
		},
	],
	events: ['pointerdown', 'pointerup'],
});

const schemas: BuilderData['schemas'] = [
	builder,
	root,
	viewport,
	content,
	scrollbarY,
	thumbY,
	scrollbarX,
	thumbX,
];

const features: BuilderData['features'] = [
	'Full keyboard navigation',
	'Can expand one or multiple items',
	'Can be controlled or uncontrolled',
];

export const scrollAreaData: BuilderData = {
	schemas,
	features,
};
