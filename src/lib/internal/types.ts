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

type StoreValues<T> = T extends { subscribe(cb: (value: infer V) => void): void } ? V : never;

type StoreValuesObj<T> = {
	[P in keyof T]: StoreValues<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BuilderReturn<T extends (...args: any) => any> = {
	[P in keyof ReturnType<T>]: P extends 'elements'
		? StoreValuesObj<ReturnType<T>[P]>
		: ReturnType<T>[P];
};

export type BuilderElements<T extends { elements: unknown }> = T['elements'];
export type BuilderActions<T extends { actions: unknown }> = T['actions'];
export type BuilderStates<T extends { states: unknown }> = T['states'];
export type BuilderHelpers<T extends { helpers: unknown }> = T['helpers'];
export type BuilderBuilders<T extends { builders: unknown }> = T['builders'];
export type BuilderOptions<T extends { options: unknown }> = T['options'];
