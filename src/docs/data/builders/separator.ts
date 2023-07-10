import { ATTRS, DESCRIPTIONS, TYPES } from '$docs/constants';
import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSeparator',
	description: DESCRIPTIONS.BUILDER('separator'),
	props: [
		{
			label: 'orientation',
			type: TYPES.ORIENTATION,
			default: "'horizontal'",
			description: 'The orientation of the separator.',
		},
		{
			label: 'decorative',
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
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const schemas = {
	builder,
	root,
};

const features = [
	'Supports horizontal and vertical orientation',
	'Supports decorative and non-decorative separators',
];

export const separatorData = {
	schemas,
	features,
};
