import { DESCRIPTIONS } from '$docs/constants';
import type { APISchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTableOfContents',
	description: DESCRIPTIONS.BUILDER('table of contents'),
	props: [
		{
			name: 'selector',
			type: 'string',
            required: true,
			description: 'The selector of the container for which the table of contents (ToC) should be created.',
		},
		{
			name: 'exclude',
			type: 'Heading[]',
			default: `['h1']`,
			description: 'A list of headings that should be excluded from the ToC.',
		},
		{
			name: 'tocType',
			type: 'TOCType',
			default: 'lowest',
			description: 'Describes which header should be considered active.',
		},
	],
	returnedProps: [
		{
			name: 'activeHeadingIdxs',
			type: 'Writable<number[]>',
			description: 'A writable store that shows the list of active headers.',
		},
		{
			name: 'headingsTree',
			type: 'Writable<TableOfContentsItem[]>',
			description: 'A writable store that lists all the headings within the specified container.',
		},
	],
};

const schemas = [builder];

const features = [
	'Customize which headers should be excluded',
];

export const tableOfContentsData: BuilderData = {
	schemas,
	features,
};
