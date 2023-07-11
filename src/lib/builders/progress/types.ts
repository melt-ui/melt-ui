import type { createProgress } from './create';

export type CreateProgressProps = {
	value?: number;
	max?: number;
};

export type CreateProgressReturn = ReturnType<typeof createProgress>;
