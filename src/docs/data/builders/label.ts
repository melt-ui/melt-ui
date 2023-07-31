import { ATTRS } from '$docs/constants';
import { builderSchema, elementSchema } from '$docs/utils/content';
import type { BuilderData } from '.';

const BUILDER_NAME = 'label';
const builder = builderSchema(BUILDER_NAME, {
	title: 'createLabel',
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the label root.',
		},
	],
});

const root = elementSchema('root', {
	description: 'The label element',
	dataAttributes: [
		{
			name: 'data-melt-label',
			value: ATTRS.MELT('label'),
		},
	],
});

const schemas = [builder, root];

const features = [
	'Supports nested controls',
	'Disables text selection when double clicking the label',
	'Can be used multiple times from a single instance of the builder',
];

export const labelData: BuilderData = {
	schemas,
	features,
};
