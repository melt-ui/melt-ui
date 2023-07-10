import { ATTRS, DESCRIPTIONS, TYPES } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createSeparator',
	description: DESCRIPTIONS.BUILDER('separator'),
	props: [
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
	],
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
