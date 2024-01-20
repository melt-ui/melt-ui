import type { Action } from 'svelte/action';
import { derived, type Readable, type Stores, type StoresValues } from 'svelte/store';
import { isBrowser, isHTMLElement, noop } from './index.js';
import { lightable } from './store/lightable.js';

export function getElementByMeltId(id: string) {
	if (!isBrowser) return null;
	const el = document.querySelector(`[data-melt-id="${id}"]`);
	return isHTMLElement(el) ? el : null;
}

export const hiddenAction = <T extends Record<string, unknown>>(obj: T) => {
	return new Proxy(obj, {
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver);
		},
		ownKeys(target) {
			return Reflect.ownKeys(target).filter((key) => key !== 'action');
		},
	});
};

type BuilderCallback<S extends Stores | undefined> = S extends Stores
	? // eslint-disable-next-line @typescript-eslint/no-explicit-any
		(values: StoresValues<S>) => Record<string, any> | ((...args: any[]) => Record<string, any>)
	: // eslint-disable-next-line @typescript-eslint/no-explicit-any
		() => Record<string, any> | ((...args: any[]) => Record<string, any>);

const isFunctionWithParams = (
	fn: unknown
): fn is (...args: unknown[]) => Record<string, unknown> => {
	return typeof fn === 'function';
};

type BuilderArgs<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
> = {
	stores?: S;
	action?: A;
	returned?: R;
};

type BuilderStore<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string,
> = Readable<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ReturnType<R> extends infer F extends (...args: any) => any
		? ((
				...args: Parameters<F>
			) => ReturnType<F> & { [K in `data-melt-${Name}`]: '' } & { action: A }) & { action: A }
		: ReturnType<R> & { [K in `data-melt-${Name}`]: '' } & { action: A }
>;

export function builder<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string,
>(name: Name, args?: BuilderArgs<S, A, R>): ExplicitBuilderReturn<S, A, R, Name> {
	const { stores, action, returned } = args ?? {};

	const derivedStore = (() => {
		if (stores && returned) {
			// If stores are provided, create a derived store from them
			return derived(stores, (values) => {
				const result = returned(values);
				if (isFunctionWithParams(result)) {
					const fn = (...args: Parameters<typeof result>) => {
						return hiddenAction({
							...result(...args),
							[`data-melt-${name}`]: '',
							action: action ?? noop,
						});
					};
					fn.action = action ?? noop;
					return fn;
				}

				return hiddenAction({
					...result,
					[`data-melt-${name}`]: '',
					action: action ?? noop,
				});
			});
		} else {
			// If stores are not provided, return a lightable store, for consistency
			const returnedFn = returned as (() => R) | undefined;
			const result = returnedFn?.();

			if (isFunctionWithParams(result)) {
				const resultFn = (...args: Parameters<typeof result>) => {
					return hiddenAction({
						...result(...args),
						[`data-melt-${name}`]: '',
						action: action ?? noop,
					});
				};
				resultFn.action = action ?? noop;

				return lightable(resultFn);
			}

			return lightable(
				hiddenAction({
					...result,
					[`data-melt-${name}`]: '',
					action: action ?? noop,
				})
			);
		}
	})() as BuilderStore<S, A, R, Name>;

	const actionFn = (action ??
		(() => {
			/** noop */
		})) as A & { subscribe: typeof derivedStore.subscribe };
	actionFn.subscribe = derivedStore.subscribe;

	return actionFn;
}

export type ExplicitBuilderReturn<
	S extends Stores | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends BuilderCallback<S>,
	Name extends string,
> = BuilderStore<S, A, R, Name> & A;

type BuilderArrayArgs<
	S extends Stores,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends object[],
> = {
	stores: S;
	returned: (values: StoresValues<S>) => R;
	action?: A;
};

export function builderArray<
	S extends Stores,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends object[],
	Name extends string,
>(name: Name, args: BuilderArrayArgs<S, A, R>): ExplicitBuilderArrayReturn<A, R, Name> {
	const { stores, returned, action } = args;

	const { subscribe } = derived(stores, (values) =>
		returned(values).map((value) =>
			hiddenAction({
				...value,
				[`data-melt-${name}`]: '',
				action: action ?? noop,
			})
		)
	) as BuilderArrayStore<A, R, Name>;

	const actionFn = (action ??
		(() => {
			/** noop */
		})) as A & { subscribe: typeof subscribe };
	actionFn.subscribe = subscribe;

	return actionFn;
}

type BuilderArrayStore<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends object[],
	Name extends string,
> = Readable<{
	[K in keyof R]: R[K] & { [K in `data-melt-${Name}`]: '' } & { action: A };
}>;

export type ExplicitBuilderArrayReturn<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	A extends Action<any, any>,
	R extends object[],
	Name extends string,
> = BuilderArrayStore<A, R, Name> & A;

export function createElHelpers<Part extends string = string>(prefix: string) {
	const name = (part?: Part) => (part ? `${prefix}-${part}` : prefix);
	const attribute = (part?: Part) => `data-melt-${prefix}${part ? `-${part}` : ''}`;
	const selector = (part?: Part) => `[data-melt-${prefix}${part ? `-${part}` : ''}]`;
	const getEl = (part?: Part) => document.querySelector(selector(part));

	return {
		name,
		attribute,
		selector,
		getEl,
	};
}
