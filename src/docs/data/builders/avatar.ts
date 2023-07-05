import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'createAvatar',
	description: 'The configuration object passed to the `createAvatar` builder function.',
	args: [
		{
			label: 'src',
			type: 'string',
			default: '""',
		},
		{
			label: 'delayMs',
			type: 'number',
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
