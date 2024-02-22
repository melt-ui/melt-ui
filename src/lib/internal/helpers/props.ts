import { removeUndefined } from '$lib/internal/helpers/object.js';
import { type Readable, type Writable } from 'svelte/store';
import { isReadable, isWritable } from './is.js';
import { withGet, type WithGet } from './withGet.js';
import { noop } from './callbacks.js';

export type MaybeWritable<T> = Readable<T> & {
	/**
	 * Same as Writable's `set` method, but if you passed in a Readonly store to this option, nothing will happen.
	 *
	 * @type {Writable<T>['set']}
	 */
	set: (v: T) => void;
	/**
	 * Same as Writable's `update` method, but if you passed in a Readonly store to this option, nothing will happen.
	 *
	 * @type {Writable<T>['update']}
	 */
	update: Writable<T>['update'];
};

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
>(props: Props | undefined, defaults: Defaults) {
	return { ...defaults, ...props } as WithDefaults<Props, Defaults>;
}

export type ReadableProp<T> = Readable<T> | Writable<T> | T;

export function parseProp<T>(prop: ReadableProp<T>): WithGet<MaybeWritable<T>> {
	if (isWritable(prop)) {
		return withGet(prop);
	} else if (isReadable(prop)) {
		return {
			...withGet(prop),
			set: noop,
			update: noop,
		};
	}
	return withGet.writable(prop);
}

export type ParsedProps<Props extends Record<string, unknown>, Defaults extends Partial<Props>> = {
	[K in keyof WithDefaults<Props, Defaults>]: WithDefaults<Props, Defaults>[K] extends ReadableProp<
		infer T
	>
	? WithGet<Writable<T>>
	: WithDefaults<Props, Defaults>[K] extends ReadableProp<infer T>
	? WithGet<MaybeWritable<T>>
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
