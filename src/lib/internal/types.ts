import type { ActionArray } from './helpers';
import type { SvelteHTMLElements } from 'svelte/elements';

// Check if type are equal or just extends
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

// Type that maps a record of custom events to their payload
// e.g. Detailed<{change: CustomEvent<string>}> should be {change: string}
export type Detailed<T> = {
	[K in keyof T]: T[K] extends CustomEvent<infer U> ? U : T[K];
};

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type BaseProps<El extends keyof SvelteHTMLElements = 'div'> = SvelteHTMLElements[El] & {
	use?: ActionArray;
	['data-testid']?: string;
	[key: `data-${string}`]: string | boolean | undefined;
};

export type Defaults<T> = {
	[K in keyof T]?: NonNullable<T[K]>;
};
