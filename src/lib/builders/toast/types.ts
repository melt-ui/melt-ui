import type { createToast } from './create';

export type CreateToastProps = {
	defaultOpen?: boolean;
	closeDelay?: number;
	type?: 'foreground' | 'background';
};

export type CreateToastReturn = ReturnType<typeof createToast>;
