import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateProgressArgs',
	description: 'The configuration object passed to the `createProgress` builder function.',
	args: [
		{
			label: 'value',
			type: 'number',
		},
		{
			label: 'max',
			type: 'number',
			default: 100,
		},
	],
};

const root: APISchema = {
	title: 'Progress',
	description: 'The progress component.',
	dataAttributes: [
		{
			label: 'data-value',
			value: 'The current value of the progress bar.',
		},
		{
			label: 'data-state',
			value: ['"indeterminate"', '"complete"', '"loading"'],
		},
		{
			label: 'data-max',
			value: 'The maximum value of the progress bar.',
		},
	],
};

const schemas = {
	builder,
	root,
};

const features = ['Assistive reading technology support for progress bar'];

export const progressData = {
	schemas,
	features,
};
