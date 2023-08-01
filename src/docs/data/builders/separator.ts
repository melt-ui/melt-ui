import { ATTRS, TYPES } from '$docs/constants';
import { builderSchema, elementSchema, genProps } from '$docs/utils';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'orientation',
		type: TYPES.ORIENTATION,
		default: "'horizontal'",
		description: 'The orientation of the separator.',
	},
	{
		name: 'decorative',
		type: 'boolean',
		default: 'false',
		description:
			'Whether or not the separator is for purely decorative purposes. This will determine if the separator is in the accessibility tree or not.',
	},
];
const BUILDER_NAME = 'separator';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createSeparator',
	props: genProps('separator', OPTION_PROPS),
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the separator root.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The separator element.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-separator',
			value: ATTRS.MELT('separator'),
		},
	],
});

const schemas = [builder, root];

const features = [
	'Supports horizontal and vertical orientation',
	'Supports decorative and non-decorative separators',
];

export const separatorData: BuilderData = {
	schemas,
	features,
};
