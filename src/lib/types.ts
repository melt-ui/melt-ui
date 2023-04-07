import type { HTMLAttributes } from 'svelte/elements';

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type BaseProps<T extends HTMLElement | SVGElement = HTMLElement> = HTMLAttributes<T> & {
	['data-testid']?: string;
	[key: `data-${string}`]: string | boolean | undefined;
};
