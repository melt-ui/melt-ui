export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type BaseProps = {
	class?: string;
};
