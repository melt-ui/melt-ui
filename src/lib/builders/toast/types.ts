import type { createToast } from './create';

export type EmptyType = Record<never, never>;

export type AddToastProps<T = {}> = {
	open?: boolean;
	closeDelay?: number;
	type?: 'foreground' | 'background';
	data: T;
};

export type Toast<T = {}> = {
	id: string;
	ids: {
		content: string;
		title: string;
		description: string;
	};
	open: boolean;
	closeDelay: number;
	type: 'foreground' | 'background';
	data: T;
};

export type CreateToastReturn = ReturnType<typeof createToast>;
