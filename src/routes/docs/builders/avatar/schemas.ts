import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateAvatarArgs',
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

export const schemas = {
	builder,
};
