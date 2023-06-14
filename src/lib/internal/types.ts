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

export type CreatePaginationArgs = {
	count: number;
	perPage?: number;
};

type NullableKeys<T> = {
	[K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

export type Defaults<T> = {
	[K in NullableKeys<T>]?: T[K];
};
