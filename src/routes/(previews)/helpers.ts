import type { ComponentProps, SvelteComponent } from 'svelte';

import type { SlideParams } from 'svelte/transition';

type RadixComponentGroup = { [key: string]: typeof SvelteComponent };

export type PreviewSchema<T extends RadixComponentGroup = RadixComponentGroup> = {
	title: string;
	description: string;
	example: unknown;
	props: PreviewProps<T>;
};

// Check if type are equal or just extends
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

type PreviewComponentProps<T extends SvelteComponent, P = ComponentProps<T>> = {
	[K in keyof P]: boolean extends NonNullable<P[K]> // If type is boolean
		? PreviewPropBoolean
		: // If type is string
		NonNullable<P[K]> extends string
		? IfEquals<
				NonNullable<P[K]>,
				string,
				PreviewPropString | PreviewPropEnum<NonNullable<P[K]>>,
				PreviewPropEnum<NonNullable<P[K]>>
		  >
		: // If type is number
		number extends NonNullable<P[K]>
		? PreviewPropNumber
		: // Special type for slide transition
		NonNullable<P[K]> extends boolean | SlideParams
		? PreviewPropBoolean
		: never;
};

type BasePreviewProp<T> = { show?: 'controls' | 'value' | null; default?: T };
export type PreviewPropBoolean = { type: 'boolean' } & BasePreviewProp<boolean>;
export type PreviewPropString = { type: 'string' } & BasePreviewProp<string>;
export type PreviewPropNumber = { type: 'number' } & BasePreviewProp<number>;
export type PreviewPropEnum<T extends string> = {
	type: 'enum';
	values: T[];
} & BasePreviewProp<T>;

export type PreviewProps<T extends RadixComponentGroup> = {
	[K in keyof T]: PreviewComponentProps<InstanceType<T[K]>>;
};

type ResolvedProps<T extends RadixComponentGroup> = {
	[K in keyof T]: ComponentProps<InstanceType<T[K]>>;
};

export function getPropsObj<T extends RadixComponentGroup>(props: PreviewProps<T>) {
	return Object.entries(props).reduce(
		(acc, [subCmp, props]) => ({
			...acc,
			[subCmp]: Object.entries(props).reduce((acc, [propName, propConfig]) => {
				const defaultValue = (propConfig as BasePreviewProp<unknown>).default;
				return { ...acc, [propName]: defaultValue };
			}, {})
		}),
		{} as PreviewProps<T>
	) as ResolvedProps<T>;
}
