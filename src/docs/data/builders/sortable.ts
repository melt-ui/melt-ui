import { ATTRS } from '$docs/constants';
import { builderSchema, elementSchema } from '$docs/utils';
import type { BuilderData } from '.';

const BUILDER_NAME = 'sortable';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'animationDuration',
		type: 'number',
		default: '150',
		description: 'The length of time in ms to animate the item to its new position.',
	},
	{
		name: 'animationEasing',
		type: 'boolean',
		default: 'false',
		description: 'Whether or not the sortable is disabled.',
	},
];

const builder = builderSchema(BUILDER_NAME, {
	title: 'createSortable',
	props: [...OPTION_PROPS],
	elements: [
		{
			name: 'zone',
			description: 'The builder store used to create the sortable zone.',
		},
		{
			name: 'item',
			description: 'The builder store used to create sortable items.',
		},
		{
			name: 'handle',
			description: 'The builder store used to create sortable handles.',
		},
	],
	options: OPTION_PROPS,
});

const zone = elementSchema('zone', {
	description: 'Contains all the parts of a sortable zone.',
	props: [
		{
			name: 'id',
			type: 'string',
			required: true,
		},
		{
			name: 'orientation',
			type: ['horizontal', 'vertical', 'both'],
			default: 'vertical',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			name: 'threshold',
			type: 'number',
			default: '0.95',
		},
		{
			name: 'fromZones',
			type: ['*', '-', 'string[]'],
			default: '-',
		},
		{
			name: 'dropzone',
			type: 'boolean',
			default: 'false',
		},
		{
			name: 'axis',
			type: ['x', 'y', 'both'],
			default: 'both',
		},
		{
			name: 'restrictTo',
			type: ['none', 'body', 'string'],
			default: 'none',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-sortable-zone',
			value: ATTRS.MELT('sortable zone'),
		},
		{
			name: 'data-sortable-id',
			value: 'The unique id of the zone.',
		},
		{
			name: 'data-sortable-orientation',
			value: "`'vertical' | 'horizontal' | 'both'`",
		},
		{
			name: 'data-sortable-disabled',
			value: ATTRS.DISABLED('zone'),
		},
		{
			name: 'data-sortable-disabled',
			value: 'Present when the zone is a dropzone.',
		},
		{
			name: 'data-sortable-focus',
			value: 'Present when an item is selected and the pointer is within the zone.',
		},
	],
});

const item = elementSchema('item', {
	description: 'Contains all the parts of a sortable zone item.',
	dataAttributes: [
		{
			name: 'data-melt-sortable-item',
			value: ATTRS.MELT('sortable item'),
		},
		{
			name: 'data-sortable-id',
			value: 'The unique id of the item.',
		},
		{
			name: 'data-sortable-disabled',
			value: ATTRS.DISABLED('item'),
		},
		{
			name: 'data-sortable-return-home',
			value:
				'Present when the item should return to its origin zone when the pointer moves outside of a foreign zone.',
		},
		{
			name: 'data-sortable-dragging',
			value: 'Present when the item is selected and being dragged.',
		},
	],
});

const handle = elementSchema('handle', {
	description: 'Contains all the parts of a sortable item handle.',
	dataAttributes: [
		{
			name: 'data-melt-sortable-handle',
			value: ATTRS.MELT('sortable handle'),
		},
	],
});

const schemas: BuilderData['schemas'] = [builder, zone, item, handle];

const features: BuilderData['features'] = [
	'Sort items within a zone or between zones',
	'Disable zones or items within zones',
	'Control the hit area of an item',
	'Create dropzones',
];

export const sortableData: BuilderData = {
	schemas,
	features,
};
