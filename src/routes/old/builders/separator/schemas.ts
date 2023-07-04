import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateSeparatorArgs',
	description: 'The configuration object passed to the `createSeparator` builder function.',
	args: [
		{
			label: 'orientation',
			type: ["'horizontal'", "'vertical'"],
			default: "'horizontal'",
		},
		{
			label: 'decorative',
			type: 'boolean',
			default: false,
		},
	],
};

export const schemas = {
	builder,
};
