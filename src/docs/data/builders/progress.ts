import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';

const builder: APISchema = {
	title: 'createProgress',
	description: DESCRIPTIONS.BUILDER('progress bar'),
	props: [
		{
			label: 'value',
			type: 'number',
			description: 'The current value of the progress bar.',
		},
		{
			label: 'max',
			type: 'number',
			default: '100',
			description: 'The maximum value of the progress bar.',
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
			value: ATTRS.MELT('root'),
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
