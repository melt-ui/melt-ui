import { type Readable, type Writable } from 'svelte/store';
import { isReadable, isWritable } from './is.js';
import { withGet, type WithGet } from './withGet.js';
import { overridable } from './overridable.js';
import { removeUndefined } from '$lib/internal/helpers/object.js';

export type WithDefaults<Props extends Record<string, unknown>, Defaults extends Partial<Props>> = {
	[K in keyof (Props & Defaults)]: K extends keyof Props
		? K extends keyof Defaults
			? undefined extends Props[K]
				? Exclude<Props[K], undefined> | Defaults[K]
				: Props[K]
			: Props[K]
		: never;
};

export function withDefaults<
	Props extends Record<string, unknown>,
	Defaults extends Partial<Props>
>(props: Props, defaults: Defaults) {
	return { ...defaults, ...props } as WithDefaults<Props, Defaults>;
}

export type WritableProp<T> = Writable<T> | T;
type ReadableProp<T> = Readable<T> | T;

export function parseProp<T>(prop: WritableProp<T> | ReadableProp<T>): WithGet<Writable<T>> {
	if (isWritable(prop)) {
		return withGet(prop);
	} else if (isReadable(prop)) {
		return overridable(prop);
	}
	return withGet.writable(prop);
}

export type ParsedProps<Props extends Record<string, unknown>, Defaults extends Partial<Props>> = {
	[K in keyof WithDefaults<Props, Defaults>]: WithDefaults<Props, Defaults>[K] extends WritableProp<
		infer T
	>
		? WithGet<Writable<T>>
		: WithDefaults<Props, Defaults>[K] extends ReadableProp<infer T>
		? WithGet<Readable<T>>
		: undefined;
};

export function parseProps<Props extends Record<string, unknown>, Defaults extends Partial<Props>>(
	props?: Props,
	defaults?: Defaults
) {
	const withDefaults = { ...defaults, ...removeUndefined(props ?? {}) } as WithDefaults<
		Props,
		Defaults
	>;
	return Object.fromEntries(
		Object.entries(withDefaults).map(([key, value]) => {
			return [key, parseProp(value)] as const;
		})
	) as ParsedProps<Props, Defaults>;
}
