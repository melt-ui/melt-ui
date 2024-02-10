import { ATTRS } from '$docs/constants.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { labelEvents } from '$lib/builders/label/events.js';
import type { BuilderData } from './index.js';

const BUILDER_NAME = 'label';
const builder = builderSchema(BUILDER_NAME, {
	title: 'createLabel',
	props: [
		{
			name: 'id',
			description: 'The id of the label.',
			type: 'string',
		},
		{
			name: 'for',
			description: 'The id of the control the label is for.',
			type: 'string',
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the label root.',
		},
	],
	states: [
		{
			name: 'mounted',
			description:
				'A readable store that is true when the label is mounted and false when it is not.',
			type: 'Readable<boolean>',
		},
	],
	options: [
		{
			name: 'id',
			description: 'The writable store for the id of the label.',
			type: 'Writable<string>',
		},
		{
			name: 'for',
			description: 'The writable store for the id of the control the label is for.',
			type: 'Writable<string>',
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
	events: labelEvents['root'],
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
