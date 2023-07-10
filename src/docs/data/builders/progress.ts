import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createProgress',
	description: DESCRIPTIONS.BUILDER('progress bar'),
	props: [
		{
			name: 'value',
			type: 'number',
			description: 'The current value of the progress bar.',
		},
		{
			name: 'max',
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
			name: 'data-value',
			value: 'The current value of the progress bar.',
		},
		{
			name: 'data-state',
			value: "`'indeterminate' | 'complete' | 'loading'`",
		},
		{
			name: 'data-max',
			value: 'The maximum value of the progress bar.',
		},
		{
			name: 'data-melt-progress',
			value: ATTRS.MELT('root'),
		},
	],
};

const schemas = [builder, root];

const features = ['Assistive reading technology support for progress bar'];

export const progressData: BuilderData = {
	schemas,
	features,
};
