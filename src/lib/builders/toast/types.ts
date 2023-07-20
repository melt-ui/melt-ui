import type { BuilderReturn } from '$lib/internal/types';
import type { createToasts } from './create';

export type EmptyType = Record<never, never>;

export type CreateToastProps = {
	closeDelay?: number;
	type?: 'foreground' | 'background';
};

export type AddToastProps<T = object> = CreateToastProps & {
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
};

export type Toasts = BuilderReturn<typeof createToasts>;
export type ToastsElements = Toasts['elements'];
export type ToastsOptions = Toasts['options'];
export type ToastsStates = Toasts['states'];
export type ToastsHelpers = Toasts['helpers'];
