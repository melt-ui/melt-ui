import { DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createAccordion',
	description: DESCRIPTIONS.BUILDER('accordion'),
	props: [
		{
			name: 'value',
			type: ['string', 'string[]', 'undefined'],
			description:
				'The value of the currently open item. You can also pass an array of values to open multiple items at once if the accordion is of type `multiple`.',
		},
	],
	returnedProps: [
		{
			name: 'isSelected',
			type: 'Readable<(key: string) => boolean>',
			description:
				'A derived store that takes a key and returns whether or not the item is selected.',
		},
	],
};

const features = ['Feature 1'];

const schemas = [builder];

export const navigationMenuData: BuilderData = {
	schemas,
	features,
};
