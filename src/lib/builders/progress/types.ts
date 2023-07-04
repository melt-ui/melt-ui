import type { createProgress } from './create';

export type CreateProgressArgs = {
	value?: number;
	max?: number;
};

export type CreateProgressReturn = ReturnType<typeof createProgress>;
