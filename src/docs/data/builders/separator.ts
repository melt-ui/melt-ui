import { ATTRS, DESCRIPTIONS, TYPES } from '$docs/constants';
import type { APISchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
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

const builder: APISchema = {
	title: 'createSeparator',
	description: DESCRIPTIONS.BUILDER('separator'),
	isBuilder: true,
	props: genProps('separator', OPTION_PROPS),
	elements: genElements('separator', [
		{
			name: 'root',
			description: 'The builder store used to create the separator root.',
		},
	]),
	options: propsToOptions('separator', OPTION_PROPS),
};

const root: APISchema = {
	title: 'root',
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
};

const schemas = [builder, root];

const features = [
	'Supports horizontal and vertical orientation',
	'Supports decorative and non-decorative separators',
];

export const separatorData: BuilderData = {
	schemas,
	features,
};
