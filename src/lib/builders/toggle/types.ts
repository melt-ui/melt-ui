import type { createToggle } from './create';

export type CreateToggleArgs = {
	disabled?: boolean;
	pressed?: boolean;
};

export type CreateToggleReturn = ReturnType<typeof createToggle>;
