import type { ActionArray } from './helpers/useActions';
import type { HTMLAttributes } from 'svelte/elements';

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type BaseProps<T extends HTMLElement = HTMLElement> = HTMLAttributes<T> & {
	use?: ActionArray;
	['data-testid']?: string;
	[key: `data-${string}`]: string | boolean | undefined;
};
