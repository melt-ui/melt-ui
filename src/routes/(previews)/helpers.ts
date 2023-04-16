import type { ComponentProps, SvelteComponent } from 'svelte';

import type { IfEquals } from '$lib/helpers/types';
import type { SlideParams } from 'svelte/transition';

type RadixComponentGroup = { [key: string]: typeof SvelteComponent };

/* --------------*/
/* Preview Props */
/* --------------*/
export type PreviewProps =
	| PreviewPropBoolean
	| PreviewPropString
	| PreviewPropNumber
	| PreviewPropArray<number | string>
	| PreviewPropEnum<string>;
type BasePreviewProp<T> = { show?: 'controls' | 'value' | null; default?: T };
export type PreviewPropBoolean = { type: 'boolean' } & BasePreviewProp<boolean>;
export type PreviewPropString = { type: 'string' } & BasePreviewProp<string>;
export type PreviewPropNumber = { type: 'number' } & BasePreviewProp<number>;
export type PreviewPropArray<T> = { type: 'number[]' | 'string[]' } & BasePreviewProp<T[]>;
export type PreviewPropEnum<T extends string> = {
	type: 'enum';
	options: T[];
} & BasePreviewProp<T>;
export type PreviewPropAny = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type: any;
	show: 'value' | null;
	default?: never;
};

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
		: // If type is string[]
		NonNullable<P[K]> extends string[]
		? PreviewPropArray<string>
		: // If type is number
		number extends NonNullable<P[K]>
		? PreviewPropNumber
		: // If type is number[]
		NonNullable<P[K]> extends number[]
		? PreviewPropArray<number>
		: // Special type for slide transition
		NonNullable<P[K]> extends boolean | SlideParams
		? PreviewPropBoolean
		: // If doesn't match any of the above
		  PreviewPropAny;
};

export type ResolvedProps<GROUP extends RadixComponentGroup> = {
	[K in keyof GROUP]: ComponentProps<InstanceType<GROUP[K]>>;
};

/* ------------------------*/
/* Preview Data Attributes */
/* ------------------------*/
export type PreviewDataAttribute = { values: string[] };
type PreviewComponentDataAttributes = {
	[key: `data-${string}`]: PreviewDataAttribute;
};

/* --------------------- */
/* Preview Meta & Schema */
/* --------------------- */
type RadixComponentPreview<CMP extends typeof SvelteComponent> = {
	props?: PreviewComponentProps<InstanceType<CMP>>;
	dataAttributes?: PreviewComponentDataAttributes;
};

export type PreviewMeta<GROUP extends RadixComponentGroup> = {
	[K in keyof GROUP]: RadixComponentPreview<GROUP[K]>;
};

export type PreviewSchema<GROUP extends RadixComponentGroup = RadixComponentGroup> = {
	title: string;
	description: string;
	example: unknown;
	code: string;
	meta: PreviewMeta<GROUP>;
};

/* --------------- */
/* Preview Getters */
/* --------------- */
function getPreviewPropsOfComponent<CMP extends typeof SvelteComponent>(
	previewProps: RadixComponentPreview<CMP>
) {
	return Object.entries(previewProps.props || {}).reduce((acc, [propName, propConfig]) => {
		const defaultValue = (propConfig as BasePreviewProp<unknown>)?.default;
		return { ...acc, [propName]: defaultValue };
	}, {});
}

export function getPropsObj<GROUP extends RadixComponentGroup>(previewMeta: PreviewMeta<GROUP>) {
	return Object.entries(previewMeta).reduce(
		(acc, [cmp, previewProps]) => ({
			...acc,
			[cmp]: getPreviewPropsOfComponent(previewProps),
		}),
		{}
	) as ResolvedProps<GROUP>;
}
