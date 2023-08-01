import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createPagination } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreatePaginationProps = {
	/**
	 * The total number of items to be paginated.
	 */
	count: number;

	/**
	 * Number of items per page
	 *
	 * @default 1
	 */
	perPage?: number;

	/**
	 * Number of visible items before and after the current page
	 *
	 * @default 1
	 */
	siblingCount?: number;

	/**
	 * The uncontrolled default page of the pagination.
	 *
	 * @default 1
	 */
	defaultPage?: number;

	/**
	 * The controlled page store for the pagination.
	 * If provided, this will override the value passed to `defaultPage`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	page?: Writable<number>;

	/**
	 * The callback invoked when the value of the page store changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onPageChange?: ChangeFn<number>;
};

export type Page = {
	type: 'page';
	value: number;
};

export type Ellipsis = {
	type: 'ellipsis';
};

export type PageItem = (Page | Ellipsis) & {
	/** Unique key for the item, to be passed to svelte #each block */
	key: string;
};

export type GetPageItemsArgs = {
	totalPages: number;
	siblingCount?: number;
	page?: number;
};

export type Pagination = BuilderReturn<typeof createPagination>;
export type PaginationElements = Pagination['elements'];
export type PaginationOptions = Pagination['options'];
export type PaginationStates = Pagination['states'];
