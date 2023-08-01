import type { ActionReturn } from 'svelte/action';

// Check if type are equal or just extends
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

export type WrapWithCustomEvent<T> = {
	[K in keyof T]: CustomEvent<T[K]>;
};

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type Arrayable<T> = T | T[];

export type CreatePaginationProps = {
	count: number;
	perPage?: number;
};

type NullableKeys<T> = {
	[K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

export type Defaults<T> = {
	[K in NullableKeys<T>]?: T[K];
};

export type TextDirection = 'ltr' | 'rtl';

export type Orientation = 'horizontal' | 'vertical';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

export type ExpandDeep<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandDeep<O[K]> }
		: never
	: T;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type StoreValue<T> = T extends { subscribe(cb: (value: infer V) => void): void } ? V : never;

export type StoreValueObj<T> = {
	[P in keyof T]: StoreValue<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BuilderReturn<T extends (...args: any) => any> = {
	[P in keyof ReturnType<T>]: ReturnType<T>[P];
};

export type EventHandler<T extends Event = Event> = (event: T) => void;

export type MeltEvent<E extends Event> = CustomEvent<{ cancel: () => void; originalEvent: E }>;

export type MeltEventHandler<E extends Event> = EventHandler<
	Expand<Omit<MeltEvent<E>, 'initCustomEvent'>>
>;

export type MeltActionReturn<Events extends keyof HTMLElementEventMap> = ActionReturn<
	undefined,
	{
		[K in Events as `on:m-${string & K}`]?: K extends keyof HTMLElementEventMap
			? MeltEventHandler<HTMLElementEventMap[K]>
			: never;
	}
>;

type ElementEvents<T> = T extends ReadonlyArray<infer U> ? U : never;

export type GroupedEvents<T> = {
	[K in keyof T]: ElementEvents<T[K]>;
};
