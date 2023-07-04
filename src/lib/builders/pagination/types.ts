import type { createPagination } from './create';

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

export type CreatePaginationReturn = ReturnType<typeof createPagination>;
