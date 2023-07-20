import type { createToasts } from './create';

export type EmptyType = Record<never, never>;

export type AddToastProps<T = object> = {
	closeDelay?: number;
	type?: 'foreground' | 'background';
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

export type CreateToastReturn = ReturnType<typeof createToasts>;
