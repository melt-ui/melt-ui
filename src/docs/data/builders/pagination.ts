import { ATTRS, KBD, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { paginationEvents } from '$lib/builders/pagination/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
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
];

const BUILDER_NAME = 'pagination';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createPagination',
	props: [
		...OPTION_PROPS,
		{
			name: 'defaultPage',
			type: 'number',
			default: '1',
			description: 'The default page number.',
		},
		{
			name: 'page',
			type: 'Writable<number>',
			description: 'A writable store that controls the current page.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onPageChange',
			type: 'ChangeFn<number>',
			description:
				'A callback called when the page of the `page` store should be changed. This is useful for controlling the page of the pagination from outside the pagination.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	],
	elements: [
		{
			name: 'root',
			description: 'The builder store used to create the pagination root.',
		},
		{
			name: 'pageTrigger',
			description: 'The builder store used to create the pagination page trigger.',
		},
		{
			name: 'prevButton',
			description: 'The builder store used to create the pagination previous button.',
		},
		{
			name: 'nextButton',
			description: 'The builder store used to create the pagination next button.',
		},
	],
	states: [
		{
			name: 'range',
			type: 'Readable<{start: number; end: number}>',
			description: 'A readable store that contains the start and end page numbers.',
		},
		{
			name: 'pages',
			type: 'Readable<PageItem[]>',
			description: 'A readable store that contains the page items.',
		},
		{
			name: 'totalPages',
			type: 'Readable<number>',
			description: 'A readable store that contains the total number of pages.',
		},
		{
			name: 'page',
			type: 'Writable<number>',
			description: 'A writable store that contains the current page number.',
		},
	],
	options: OPTION_PROPS,
});

const root = elementSchema('root', {
	description: 'The root element of the pagination component.',
	dataAttributes: [
		{
			name: 'data-scope',
			value: '`pagination`',
		},
		{
			name: 'data-melt-pagination',
			value: ATTRS.MELT(BUILDER_NAME),
		},
	],
});

const pageTrigger = elementSchema('pageTrigger', {
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
	events: paginationEvents['pageTrigger'],
});

const prevButton = elementSchema('prevButton', {
	description: 'A button that moves to the previous page.',
	dataAttributes: [
		{
			name: 'data-melt-pagination-prev-button',
			value: ATTRS.MELT('prevButton'),
		},
	],
	events: paginationEvents['prevButton'],
});

const nextButton = elementSchema('nextButton', {
	description: 'A button that moves to the next page.',
	dataAttributes: [
		{
			name: 'data-melt-pagination-next-button',
			value: ATTRS.MELT('nextButton'),
		},
	],
	events: paginationEvents['nextButton'],
});

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
