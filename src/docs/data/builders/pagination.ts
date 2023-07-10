import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createPagination',
	description: DESCRIPTIONS.BUILDER('pagination'),
	props: [
		{
			name: 'count',
			type: 'number',
			description: 'The total number of items.',
		},
		{
			name: 'perPage',
			type: 'number',
			default: '1',
			description: 'The number of items per page.',
		},
		{
			name: 'siblingCount',
			type: 'number',
			default: '1',
			description: 'The number of page triggers to show on either side of the current page.',
		},
		{
			name: 'page',
			type: 'number',
			default: '1',
			description: 'The current page number.',
		},
	],
};

const root: APISchema = {
	title: 'root',
	description: 'The root element of the pagination component.',
	dataAttributes: [
		{
			name: 'data-scope',
			value: '`pagination`',
		},
		{
			name: 'data-melt-pagination',
			value: ATTRS.MELT('pagination'),
		},
	],
};

const pageTrigger: APISchema = {
	title: 'pageTrigger',
	description: 'A button that triggers a page change.',
	dataAttributes: [
		{
			name: 'data-selected',
			value: 'Present when the page is selected.',
		},
		{
			name: 'data-melt-pagination-page-trigger',
			value: ATTRS.MELT('pageTrigger'),
		},
	],
};

const prevButton: APISchema = {
	title: 'prevButton',
	description: 'A button that moves to the previous page.',
	dataAttributes: [
		{
			name: 'data-melt-pagination-prev-button',
			value: ATTRS.MELT('prevButton'),
		},
	],
};

const nextButton: APISchema = {
	title: 'nextButton',
	description: 'A button that moves to the next page.',
	dataAttributes: [
		{
			name: 'data-melt-pagination-next-button',
			value: ATTRS.MELT('nextButton'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'When focused on a `pageTrigger` or `nextButton`, moves to that page.',
	},
	{
		key: KBD.ENTER,
		behavior: 'When focused on a `pageTrigger` or `nextButton`, moves to that page.',
	},
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the next focusable element.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior: 'Moves focus to the previous focusable element',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves focus to the next focusable `pageTrigger` or `nextButton`.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves focus to the previous focusable `pageTrigger` or `prevButton`',
	},
	{
		key: KBD.HOME,
		behavior: 'Moves focus to the first focusable `pageTrigger` or `prevButton`.',
	},
	{
		key: KBD.END,
		behavior: 'Moves focus to the first focusable `pageTrigger` or `prevButton`.',
	},
];

const schemas = [builder, root, pageTrigger, prevButton, nextButton];

const features = [
	'Full keyboard navigation support',
	'Supports a custom number of pages',
	'Display range of visible pages',
	'Supports a custom number of visible pages',
	'Supports a custom number of sibling pages',
];

export const paginationData: BuilderData = {
	schemas,
	features,
	keyboard,
};
