import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createPagination } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreatePaginationProps = {
	/** Number of total items */
	count: number;
	/** Number of items per page */
	perPage?: number;
	/** Number of visible items before and after the current page */
	siblingCount?: number;
	/** Current page */
	defaultPage?: number;

	page?: Writable<number>;
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
