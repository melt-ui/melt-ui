import { ATTRS, DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createLabel',
	description: DESCRIPTIONS.BUILDER('label'),
	returnedProps: [
		{
			name: 'root',
			description: 'The builder store used to create the label root.',
			link: '#root',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The label element',
	dataAttributes: [
		{
			name: 'data-melt-label',
			value: ATTRS.MELT('label'),
		},
	],
};

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
