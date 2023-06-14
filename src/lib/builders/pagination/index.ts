import { elementDerived, elementMultiDerived, omit } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

export type CreatePaginationArgs = {
	/** Number of total items */
	count: number;
	/** Number of items per page */
	perPage?: number;
	/** Number of visible items before and after the current page */
	siblingCount?: number;
	/** Current page */
	page?: number;
};

const defaults = {
	perPage: 10,
	siblingCount: 1,
	page: 1,
} satisfies Defaults<CreatePaginationArgs>;

export function createPagination(args: CreatePaginationArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'page'));
	const page = writable(withDefaults.page);

	const totalPages = derived([options], ([$options]) => {
		return Math.ceil($options.count / $options.perPage);
	});

	const range = derived([page, options], ([$page, $options]) => {
		const start = ($page - 1) * $options.perPage;
		const end = start + $options.perPage;
		return { start, end };
	});

	type Page = {
		type: 'page';
		value: number;
	};

	type Ellipsis = {
		type: 'ellipsis';
	};

	type PageItem = Page | Ellipsis;

	const pages = derived([page, totalPages, options], ([$page, $totalPages, { siblingCount }]) => {
		const res: Array<PageItem> = [{ type: 'page', value: 1 }];

		const firstItemWithSiblings = 3 + siblingCount;
		const lastItemWithSiblings = $totalPages - 3 - siblingCount;

		console.log(firstItemWithSiblings, lastItemWithSiblings);

		if ($page < firstItemWithSiblings) {
			for (let i = 2; i <= firstItemWithSiblings + siblingCount; i++) {
				res.push({ type: 'page', value: i });
			}
			res.push({ type: 'ellipsis' });
		} else if ($page > lastItemWithSiblings) {
			res.push({ type: 'ellipsis' });
			for (let i = lastItemWithSiblings - siblingCount + 1; i <= $totalPages - 1; i++) {
				res.push({ type: 'page', value: i });
			}
		} else {
			res.push({ type: 'ellipsis' });
			for (let i = $page - siblingCount; i <= $page + siblingCount; i++) {
				res.push({ type: 'page', value: i });
			}
			res.push({ type: 'ellipsis' });
		}

		res.push({ type: 'page', value: $totalPages });
		return res;
	});

	const pageTrigger = elementMultiDerived(page, ($page, { attach }) => {
		return (pageItem: Page) => {
			attach('click', () => {
				page.set(pageItem.value);
			});

			return {
				'aria-label': `Page ${pageItem.value}`,
				'data-selected': pageItem.value === $page ? '' : undefined,
			};
		};
	});

	const prevButton = elementDerived([page], ([$page], { attach }) => {
		if ($page > 1) {
			attach('click', () => {
				page.set($page - 1);
			});
		}

		return {
			'aria-label': 'Previous',
			disabled: $page <= 1,
		} as const;
	});

	const nextButton = elementDerived([page, totalPages], ([$page, $numPages], { attach }) => {
		if ($page < $numPages) {
			attach('click', () => {
				page.set($page + 1);
			});
		}

		return {
			'aria-label': 'Next',
			disabled: $page >= $numPages,
		} as const;
	});

	return {
		options,
		page,
		pages,
		pageTrigger,
		prevButton,
		nextButton,
		totalPages,
		range,
	};
}
