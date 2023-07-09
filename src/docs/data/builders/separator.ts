import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSeparator',
	description: 'The configuration object passed to the `createSeparator` builder function.',
	props: [
		{
			label: 'orientation',
			type: ["'horizontal'", "'vertical'"],
			default: "'horizontal'",
		},
		{
			label: 'decorative',
			type: 'boolean',
			default: 'false',
		},
	],
};

const schemas = {
	builder,
};

const features = [
	'Supports horizontal and vertical orientation',
	'Supports decorative and non-decorative separators',
];

export const separatorData = {
	schemas,
	features,
};
