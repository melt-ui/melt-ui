import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createAvatar',
	description: 'The configuration object passed to the `createAvatar` builder function.',
	props: [
		{
			label: 'src',
			type: 'string',
			default: '""',
		},
		{
			label: 'delayMs',
			type: 'number',
			description: 'The number of milliseconds to wait before rendering the fallback image.',
			default: 'undefined',
		},
	],
};

const schemas = {
	builder,
};

const features = [
	'Automatic & manual control over image rendering',
	'Fallback supports any children elements',
	'Optionally delay fallback rendering to avoid flashes',
];

export const avatarData = {
	schemas,
	features,
};
