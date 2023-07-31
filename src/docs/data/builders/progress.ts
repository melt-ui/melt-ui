import { ATTRS, SEE } from '$docs/constants';
import { builderSchema, elementSchema } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'max',
		type: 'number',
		default: '100',
		description: 'The maximum value of the progress bar.',
	},
];
const BUILDER_NAME = 'progress';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createProgress',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'number',
			description: 'The default value of the progress bar.',
			default: '0',
		},
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'A writable store that controls the current value of the progress bar.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<number>',
			description: 'A callback that is called when the value of the progress bar changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the progress bar.',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Readable<number>',
			description: 'A readable store with the current value of the progress bar.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The root progress component.',
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
});

const schemas = [builder, root];

const features = ['Assistive reading technology support for progress bar'];

export const progressData: BuilderData = {
	schemas,
	features,
};
