import { ATTRS } from '$docs/constants.js';
import type { APISchema, KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';

const keyboard: KeyboardSchema = [
];

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const builder = builderSchema('checkbox', {
	title: 'createChart',
	props: [
		{
			name: 'data',
			type: ['Array<ROW>', 'Readable<Array<ROW>>'],
			description:
				'The data used to drive the chart',
		},
		{
			name: 'meta',
			type: ['undefined', 'any', 'Readable<any>'],
			default: 'undefined',
			description:
				'Arbitrary meta data for the chart',
		},
		{
			name: 'width',
			type: ['number', 'Readable<number>'],
			description:
				'The width (in pixels) of the chart',
		},
		{
			name: 'height',
			type: ['number', 'Readable<number>'],
			description:
				'The height (in pixels) of the chart',
		},
		{
			name: 'margin',
			default: '0',
			type: ['number', 'Sides', 'Readable<number | Sides>'],
			description:
				'The margin of the chart',
		},
		{
			name: 'padding',
			default: '0',
			type: ['number', 'Sides', 'Readable<number | Sides>'],
			description:
				'The margin of the chart',
		},
		{
			name: 'dimensions',
			type: 'Record<string, Dimension>',
			description:
				'A record of dimensions required for the chart'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.accessor',
			type: ['keyof ROW', '(row, meta) => value', 'Readable<keyof ROW | (row, meta) => value>'],
			description:
				'key or method used to extract a domain value(s) from a row'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.range',
			type: [
				'undefined',
				'[min: number, ...number[], max: number]',
				'(props: { area_d: Area, meta: META }) => [min: number, ...number[], max: number]',
				'Readable<undefined | [min: number, ...number[], max: number] | (props: { area_d: Area, meta: META }) => [min: number, ...number[], max: number]>',
			],
			description:
				'the range of values which the domain is mapped to'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.reverse',
			type: [
				'undefined',
				'boolean',
				'Readable<undefined | boolean>',
			],
			description:
				'If true, reverses the domain. This is primarily useful for the cardinal vertical (usually y) axis as larger values are traditionally towards the top of the chart which is opposite to the usual html/svg coordinate system'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.extents',
			type: [
				'undefined',
				'[min: number, max: number]',
				'Set([...values])',
				'Readable<undefined | [min: number, max: number] | Set([...values])>',
			],
			description:
				'If undefined, extents are calculated dynamically from the provided data. By providing extents explicitly, these calculations can be avoided'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.domain',
			type: [
				'undefined',
				'[min: number | null, max: number | null]',
				'(extents, { meta }) => [min: number | null, max: number | null] | undefined',
				'Readable<undefined | [min: number, max: number] | ((extents, { meta }) => [min: number | null, max: number | null] | undefined)>',
				'[...values]',
				'Set([...values])',
				'(extents, { meta }) => [...values] | Set([...values]) | undefined',
				'Readable<undefined | [...values] | Set([...values]) | ((extents, { meta }) => [...values] | Set([...values]) | undefined)>',
			],
			description:
				'If undefined, domain is calculated from extents. If `min` or `max` is null, they are taken from extents'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.sort',
			type: [
				'undefined',
				'(a, b) => number',
				'Readable<undefined | (a, b) => number>',
			],
			description:
				'Only valid in discrete dimensions. Used to sort domain values via Array.sort'
		},
		{
			name: 'dimension\r\n.<NAME>\r\n.scalerFactory',
			type: [
				'({ meta, domain_d, range_d }) => Scale',
				'Readable<{ meta, domain_d, range_d }) => Scale>',
			],
			description:
				'Using the provided meta, domain_d and range_d inputs, creates and initialises a scale function which is used to map domain values to range values'
		},
	]
});

const root = elementSchema('root', {
	description: 'The chart root element.',
	dataAttributes: [
		{
			name: 'data-melt-chart',
			value: ATTRS.MELT('chart'),
		},
	]
});

const schemas: APISchema[] = [
	builder,
	root
];

const features = [
	'All specifiers can be controlled or uncontrolled',
	'User definable dimensions',
	'Supports any number of dimensions',
	'Defaults for cardinal dimensions',
];

export const chartData: BuilderData = {
	schemas,
	features,
	keyboard,
};