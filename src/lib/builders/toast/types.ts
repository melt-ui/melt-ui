import type { BuilderReturn } from '$lib/internal/types.js';
import type { createToaster } from './create.js';
export type { ToastComponentEvents } from './events.js';
export type EmptyType = Record<never, never>;

export type CreateToasterProps = {
	// Time in milliseconds before the toast is automatically closed.
	// If set to 0, the toast will not be automatically closed.
	closeDelay?: number | undefined;
	type?: 'foreground' | 'background' | undefined;
	hover?: 'pause' | 'pause-all' | null | undefined;
};

export type AddToastProps<T = object> = Omit<CreateToasterProps, 'hover'> & {
	data: T;
};

export type Toast<T = object> = {
	id: string;
	ids: {
		content: string;
		title: string;
		description: string;
	};
	closeDelay: number;
	type: 'foreground' | 'background';
	data: T;
	timeout: number | null;
	createdAt: number;
	pausedAt?: number | undefined;
	pauseDuration: number;
	getPercentage: () => number;
};

export type Toasts<T = object> = BuilderReturn<typeof createToaster<T>>;
export type ToastsElements<T = object> = BuilderReturn<typeof createToaster<T>>['elements'];
export type ToastsOptions<T = object> = BuilderReturn<typeof createToaster<T>>['options'];
export type ToastsStates<T = object> = BuilderReturn<typeof createToaster<T>>['states'];
export type ToastsHelpers<T = object> = BuilderReturn<typeof createToaster<T>>['helpers'];
