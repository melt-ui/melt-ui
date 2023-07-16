import type { createToast } from './create';

export type CreateToastProps = {
	defaultOpen?: boolean;
	closeDelay?: number;
};

export type CreateToastReturn = ReturnType<typeof createToast>;
