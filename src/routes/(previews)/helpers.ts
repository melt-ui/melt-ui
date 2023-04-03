import type { ComponentProps, SvelteComponent } from 'svelte';

import type { SlideParams } from 'svelte/transition';

type RadixComponentGroup = { [key: string]: typeof SvelteComponent };

export type PreviewSchema<GROUP extends RadixComponentGroup = RadixComponentGroup> = {
	title: string;
	description: string;
	example: unknown;
	props: RadixComponentGroupPreview<GROUP>;
};

// Check if type are equal or just extends
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

type PreviewComponentProps<CMP extends SvelteComponent, P = ComponentProps<CMP>> = {
	[K in keyof P]: K extends  // If key matches "data-"
	`data-${string}`
		? never
		: // If type is boolean
		boolean extends NonNullable<P[K]>
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

type PreviewComponentDataAttributes<CMP extends SvelteComponent, P = ComponentProps<CMP>> = {
	[K in keyof P]: K extends  // If key matches "data-"
	`data-${string}`
		? PreviewDataAttribute
		: never;
};

type BasePreviewProp<T> = { hideControls?: boolean; default?: T };
export type PreviewPropBoolean = { type: 'boolean' } & BasePreviewProp<boolean>;
export type PreviewPropString = { type: 'string' } & BasePreviewProp<string>;
export type PreviewPropNumber = { type: 'number' } & BasePreviewProp<number>;
export type PreviewPropEnum<T extends string> = {
	type: 'enum';
	options: T[];
} & BasePreviewProp<T>;

export type PreviewDataAttribute = { values: string[] };

/**
 * Preview definition for a component group
 */
export type RadixComponentGroupPreview<GROUP extends RadixComponentGroup> = {
	[K in keyof GROUP]: RadixComponentPreview<GROUP[K]>;
};

type RadixComponentPreview<CMP extends typeof SvelteComponent> = {
	props?: PreviewComponentProps<InstanceType<CMP>>;
	dataAttributes?: PreviewComponentDataAttributes<InstanceType<CMP>>;
};
type ResolvedProps<GROUP extends RadixComponentGroup> = {
	[K in keyof GROUP]: ComponentProps<InstanceType<GROUP[K]>>;
};

function getPreviewPropsOfComponent<CMP extends typeof SvelteComponent>(
	previewProps: RadixComponentPreview<CMP>
) {
	return Object.entries(previewProps.props || {}).reduce((acc, [propName, propConfig]) => {
		const defaultValue = (propConfig as BasePreviewProp<unknown>).default;
		return { ...acc, [propName]: defaultValue };
	}, {});
}
export function getPropsObj<GROUP extends RadixComponentGroup>(
	previewProps: RadixComponentGroupPreview<GROUP>
) {
	return Object.entries(previewProps).reduce(
		(acc, [cmp, previewProps]) => ({
			...acc,
			[cmp]: getPreviewPropsOfComponent(previewProps)
		}),
		{}
	) as ResolvedProps<GROUP>;
}
