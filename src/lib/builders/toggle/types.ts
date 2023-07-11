import type { createToggle } from './create';

export type CreateToggleProps = {
	disabled?: boolean;
	pressed?: boolean;
};

export type CreateToggleReturn = ReturnType<typeof createToggle>;
