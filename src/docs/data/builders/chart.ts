import { ATTRS } from '$docs/constants.js';
import type { APISchema, KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';

const keyboard: KeyboardSchema = [
];

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const builder = builderSchema('chart', {
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
			name: 'dimension.\n<NAME>.\nget',
			type: ['Key', 'Accessor', 'Readable<Key | Accessor>'],
			required: true,
			longType: {
				rawCode:
					'type Key<ROW> = keyof ROW;\n' +
					'type Accessor<ROW,META,DOMAIN> = (row: ROW, { meta: META }) => DOMAIN;\n'
			},
			description:
				'key or method used to extract a domain value(s) from a row\n' +
				'One of either get or get_sub must be provided'
		},
		{
			name: 'dimension.\n<NAME>.\nget_sub',
			type: [
				'Record<Key, Accessor | Readable<Key | Accessor>>'
			],
			required: true,
			longType: {
				rawCode:
					'type Key<ROW> = keyof ROW;\n' +
					'type Accessor<ROW,META,DOMAIN> = (row: ROW, { meta: META }) => DOMAIN;\n'
			},
			description:
				'Record of keys/methods used to extract a domain value(s) from a row\n' +
				'One of either get or get_sub must be provided'
		},
		{
			name: 'dimension.\n<NAME>.\nrange',
			type: [
				'undefined',
				'RangeList',
				'RangeFunc',
				'Readable<undefined | RangeList | RangeFunc>',
			],
			longType: {
				rawCode:
					'type RangeList<RANGETYPE> = [RANGETYPE, RANGETYPE, ...RANGETYPE[]];\n' +
					'type RangeFunc<RANGETYPE, META> = (info: { area: Area, meta: META }) => RangeList<RANGETYPE>;'
			},
			description:
				'the range of values which the domain is mapped to'
		},
		{
			name: 'dimension.\n<NAME>.\nreverse',
			type: [
				'undefined',
				'boolean',
				'Readable<undefined | boolean>',
			],
			description:
				'If true, reverses the domain.\n' +
				'This is primarily useful for the cardinal vertical (usually y) axis as larger values are traditionally towards the top of the chart which is opposite to the usual html/svg coordinate system'
		},
		{
			name: 'dimension.\n<NAME>.\nextents',
			type: [
				'undefined',
				'ExtentsDiscrete',
				'ExtentsContinuous',
				'Readable<undefined | ExtentsDiscrete>',
				'Readable<undefined | ExtentsContinuous>',
			],
			longType: {
				rawCode:
					'type ExtentsDiscreteArray<DOMAINTYPE> = DOMAINTYPE[];\n' +
					'type ExtentsDiscreteSet<DOMAINTYPE> = ReadonlySet<DOMAINTYPE>;\n' +
					'type ExtentsDiscreteFunc<DOMAINTYPE, META> = (info: { meta: META }) => (ExtentsDiscreteArray<DOMAINTYPE> | ExtentsDiscreteSet<DOMAINTYPE> | undefined);\n' +
					'type ExtentsDiscrete<DOMAINTYPE, META> = ExtentsDiscreteArray<DOMAINTYPE> | ExtentsDiscreteSet<DOMAINTYPE> | ExtentsDiscreteFunc<DOMAINTYPE, META>;\n' +
					'type ExtentsContinuousBound<DOMAINTYPE> = [DOMAINTYPE, DOMAINTYPE];\n' +
					'type ExtentsContinuousFunc<DOMAINTYPE, META> = (info: { meta: META }) => (ExtentsContinuousBound<DOMAINTYPE> | undefined);\n' +
					'type ExtentsContinuous<DOMAINTYPE, META> = ExtentsContinuousBound<DOMAINTYPE> | ExtentsContinuousFunc<DOMAINTYPE, META>;'
			},
			description:
				'Specify the full extents of the data.\n' +
				'For discrete domains, this resolves to a set. For continuous domains, this resolves to a range.\n' +
				'If undefined, extents are calculated dynamically from the provided data. By providing extents explicitly, these calculations can be avoided\n'
		},
		{
			name: 'dimension.\n<NAME>.\ndomain',
			type: [
				'undefined',
				'DomainDiscrete',
				'DomainContinuous',
				'Readable<undefined | DomainDiscrete>',
				'Readable<undefined | DomainContinuous>',
			],
			longType: {
				rawCode:
					'type DomainDiscreteArray<DOMAINTYPE> = DOMAINTYPE[];\n' +
					'type DomainDiscreteSet<DOMAINTYPE> = ReadonlySet<DOMAINTYPE>;\n' +
					'type DomainDiscreteFunc<DOMAINTYPE, META> = (extents: ExtentsDiscreteSet<DOMAINTYPE>, info: { meta: META }) => (DomainDiscreteArray<DOMAINTYPE> | DomainDiscreteSet<DOMAINTYPE> | undefined);\n' +
					'type DomainDiscrete<DOMAINTYPE, META> = DomainDiscreteArray<DOMAINTYPE> | DomainDiscreteSet<DOMAINTYPE> | DomainDiscreteFunc<DOMAINTYPE, META>;\n' +
					'type DomainContinuousOptionalBound<DOMAINTYPE> = [DOMAINTYPE | undefined | null, DOMAINTYPE | undefined | null];\n' +
					'type DomainContinuousBound<DOMAINTYPE> = [DOMAINTYPE, DOMAINTYPE];\n' +
					'type DomainContinuousFunc<DOMAINTYPE, META> = (extents: undefined | ExtentsContinuousBound<DOMAINTYPE>, info: { meta: META }) => (DomainContinuousOptionalBound<DOMAINTYPE> | DomainContinuousBound<DOMAINTYPE> | undefined);\n' +
					'type DomainContinuous<DOMAINTYPE, META> = DomainContinuousOptionalBound<DOMAINTYPE> | DomainContinuousBound<DOMAINTYPE> | DomainContinuousFunc<DOMAINTYPE, META>;'
			},
			description:
				'If undefined, domain is calculated from extents. If `min` or `max` is null, they are taken from extents'
		},
		{
			name: 'dimension.\n<NAME>.\nsort',
			type: [
				'undefined',
				'Comparator',
				'Readable<undefined | Comparator>',
			],
			longType: {
				rawCode:
					'type Comparator<DOMAIN> = (a: DOMAIN, b: DOMAIN) => number'
			},
			description:
				'Only valid in discrete dimensions.\n' +
				'If provided, sorts the domain values using using the provided Comparator'
		},
		{
			name: 'dimension.\n<NAME>.\nscaleFactory',
			type: [
				'ScaleFactoryDiscrete',
				'ScaleFactoryContinuous',
				'Readable<ScaleFactoryDiscrete>',
				'Readable<ScaleFactoryContinuous>',
			],
			required: true,
			longType: {
				rawCode:
					'type ScaleFactoryDiscrete<DOMAINTYPE, RANGETYPE, META, SCALER extends Scale<DOMAINTYPE, RANGETYPE>> = (info: { meta: META, domain_d: DomainDiscreteSet<DOMAINTYPE>, range_d: RangeList<RANGETYPE> | undefined }) => SCALER;\n' +
					'type ScaleFactoryContinuous<DOMAINTYPE, RANGETYPE, META, SCALER extends Scale<DOMAINTYPE, RANGETYPE>> = (info: { meta: META, domain_d: undefined | DomainContinuousBound<DOMAINTYPE>, range_d: RangeList<RANGETYPE> | undefined }) => SCALER;'
			},
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
	'End to end type safety when defining chart dimensions',
	'Supports any number of dimensions',
	'Defaults for cardinal dimensions',
	'Support for overlaying charts'
];

export const chartData: BuilderData = {
	schemas,
	features,
	keyboard,
};