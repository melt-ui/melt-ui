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

export type BuilderReturn<T extends (...args: any) => any> = {
	[P in keyof ReturnType<T>]: P extends 'elements'
		? StoreValuesObj<ReturnType<T>[P]>
		: ReturnType<T>[P];
};
