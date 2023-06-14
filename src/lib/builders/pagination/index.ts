import type { Defaults } from '$lib/internal/types';

export type CreatePaginationArgs = {
	count: number;
	perPage?: number;
};

const defaults = {
	perPage: 10,
} satisfies Defaults<CreatePaginationArgs>;
