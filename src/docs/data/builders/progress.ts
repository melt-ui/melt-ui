import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createProgress',
	description: 'The configuration object passed to the `createProgress` builder function.',
	props: [
		{
			label: 'value',
			type: 'number',
		},
		{
			label: 'max',
			type: 'number',
			default: '100',
		},
	],
};

const root: APISchema = {
	title: 'progress',
	description: 'The progress component.',
	dataAttributes: [
		{
			label: 'data-value',
			value: 'The current value of the progress bar.',
		},
		{
			label: 'data-state',
			value: "`'indeterminate' | 'complete' | 'loading'`",
		},
		{
			label: 'data-max',
			value: 'The maximum value of the progress bar.',
		},
		{
			label: 'data-melt-progress',
			value: 'Present on the progress element.',
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
