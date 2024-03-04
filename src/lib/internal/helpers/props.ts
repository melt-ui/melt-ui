import { omit, removeUndefined } from '$lib/internal/helpers/object.js';
import { type Readable, type Writable } from 'svelte/store';
import { noop } from './callbacks.js';
import { generateIds, type IdObj } from './id.js';
import { isObject, isReadable, isWritable } from './is.js';
import { withGet, type WithGet } from './withGet.js';

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

type _Extends_Props = Record<string, unknown>;
type _Extends_Defaults<Props extends _Extends_Props> = Partial<Props>;
type _Extends_IdParts = readonly string[] | undefined;

type _Defaults_IdParts = undefined;

type GetIdParts<
	Props extends _Extends_Props,
	Defaults extends _Extends_Defaults<Props>,
	IdParts extends _Extends_IdParts = _Defaults_IdParts
> = readonly (
	| (IdParts extends readonly string[] ? IdParts[number] : never)
	| (WithDefaults<Props, Defaults> extends { ids: infer T } ? keyof T : never)
)[];

type _Test_GetIdParts_1 = GetIdParts<
	{
		ids: { trigger: string; content: string };
	},
	Record<string, never>,
	['trigger']
>;

type _Test_GetIdParts_2 = GetIdParts<
	{
		ids: { trigger: string; content: string };
	},
	Record<string, never>,
	['close']
>;

type _Test_GetIdParts_3 = GetIdParts<
	{
		ids: { trigger: string; content: string };
	},
	Record<string, never>
>;

type GetIdObj<
	Props extends _Extends_Props,
	Defaults extends _Extends_Defaults<Props>,
	IdParts extends _Extends_IdParts = _Defaults_IdParts
> = GetIdParts<Props, Defaults, IdParts> extends readonly string[]
	? Expand<IdObj<GetIdParts<Props, Defaults, IdParts>>>
	: undefined;

export type ParsedProps<
	Props extends _Extends_Props,
	Defaults extends _Extends_Defaults<Props>,
	IdParts extends _Extends_IdParts = _Defaults_IdParts
> = {
	[K in keyof Omit<WithDefaults<Props, Defaults>, 'ids'>]: WithDefaults<
		Props,
		Defaults
	>[K] extends ReadableProp<infer T>
		? WithGet<Writable<T>>
		: WithDefaults<Props, Defaults>[K] extends ReadableProp<infer T>
		? WithGet<MaybeWritable<T>>
		: undefined;
} & {
	ids: GetIdObj<Props, Defaults, IdParts>;
};

type ParsePropsArgs<
	Props extends _Extends_Props,
	Defaults extends _Extends_Defaults<Props>,
	IdParts extends _Extends_IdParts = _Defaults_IdParts
> = {
	props?: Props;
	defaults?: Defaults;
	idParts?: IdParts;
};

/**
 * Returns a merged object of the props and defaults with the props overwriting the defaults.
 * The props can be stores or static values. All of the props will be converted to `withGet` stores.
 *
 * If the props contain an `ids` object, it will be parsed and returned as a separate object, where
 * each property is itself a `WithGet<Writable<string>>` store.
 */
export function parseProps<
	Props extends _Extends_Props,
	Defaults extends _Extends_Defaults<Props>,
	const IdParts extends _Extends_IdParts = _Defaults_IdParts
>({ props, defaults, idParts }: ParsePropsArgs<Props, Defaults, IdParts>) {
	const withDefaults = omit(
		{ ...defaults, ...removeUndefined(props ?? {}) } as WithDefaults<Props, Defaults>,
		'ids'
	);

	const parsedIdParts = (idParts ?? []) as NonNullable<IdParts>;

	let idObj = undefined;
	if (isObject(props?.ids) || parsedIdParts.length > 0) {
		idObj = parseProps({
			props: { ...generateIds(parsedIdParts), ...(props?.ids ?? {}) },
		}) as unknown as GetIdObj<Props, Defaults, IdParts>;
	}

	const res = Object.fromEntries(
		Object.entries(withDefaults).map(([key, value]) => {
			return [key, parseProp(value)] as const;
		})
	) as ParsedProps<Props, Defaults, IdParts>;

	if (idObj !== undefined) {
		res.ids = idObj;
	}
	return res;
}
