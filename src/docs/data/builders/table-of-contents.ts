import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';
import { tableOfContentsEvents } from '$lib/builders/table-of-contents/events';
import { elementSchema } from '$docs/utils';

const builder: APISchema = {
	title: 'createTableOfContents',
	description: DESCRIPTIONS.BUILDER('table of contents'),
	props: [
		{
			name: 'selector',
			type: 'string',
			required: true,
			description:
				'The selector of the container for which the table of contents (ToC) should be created.',
		},
		{
			name: 'exclude',
			type: 'Heading[]',
			default: `['h1']`,
			description:
				"A list of headings that should be excluded from the ToC. Possible heading values: `'h1'` | `'h2'` | `'h3'` | `'h4'` | `'h5'` | `'h6'`.",
		},
		{
			name: 'activeType',
			type: "'all' | 'lowest' | 'highest' | 'lowest-parents' | 'highest-parents'",
			default: 'lowest',
			description:
				"Describes which header should be considered active.\n\n\
`'none'` means that no intersection observers are added and no headings are considered active.\n\
`'all'` means that all headings with visible content are considered active.\n\
`'lowest'` means that the heading of the lowest visible content is considered active.\n\
`'highest'` means the opposite.\n\
`'lowest-parents'` means that parents of the heading with the lowest visible content are also considered active, and the same goes for `'highest-parents'`.",
		},
		{
			name: 'scrollOffset',
			type: 'number',
			default: '0',
			description:
				'The number of pixels to add to the top of the element when scrolling. Can be used if you have a fixed header which might block the scrolled-to element.',
		},
		{
			name: 'scrollBehaviour',
			type: "'smooth' | 'instant'",
			default: 'smooth',
			description: "Defines whether the scroll behaviour should be 'smooth' or 'instant'.",
		},
		{
			name: 'headingFilterFn',
			type: 'HeadingFilterFn',
			description:
				"Allows you to pass a filter function to filter the headings that are returned in the 'headingsTree' store. The filter function gets an HTMLHeadingElement passed to it.",
		},
		{
			name: 'scrollFn',
			type: 'ScrollFn',
			description:
				'Allows you to overwrite the default scroll function with your own custom one. The scroll function gets the heading id passed to it.',
		},
	],
	builders: [
		{
			name: 'item',
			description: 'The builder store used to create a table of contents item.',
			link: '#item',
		},
	],
	states: [
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

const item = elementSchema('item', {
	title: 'item',
	description: 'A table of contents item.',
	dataAttributes: [
		{
			name: 'data-melt-table-of-contents-item',
			value: ATTRS.MELT('item'),
		},
		{
			name: 'data-id',
			value: 'The id of the heading element the item links to.',
		},
	],
	events: tableOfContentsEvents['item'],
});

const schemas = [builder, item];

const features = [
	'Customize which headers should be excluded',
	'Choose between smooth or instant scroll behaviour',
	'Add a scroll offset if needed',
	'Define a filter function to control which headings are allowed',
	'Overwrite the default scroll function with your own',
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ENTER,
		behavior: 'Scrolls to the focused heading.',
	},
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the next focusable element.',
	},
];

export const tableOfContentsData: BuilderData = {
	schemas,
	features,
	keyboard,
};
