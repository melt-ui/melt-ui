import { writable, type Writable } from 'svelte/store';

import type { IfEquals } from '../types';
import { joinKeys, objectEntries } from './object';
import { uniqueContext } from './uniqueContext';

type ValueSetter<T> = (v: T) => void;
type WithoutNever<T> = Pick<T, { [K in keyof T]: T[K] extends never ? never : K }[keyof T]>;

type ValueSetters<T> = WithoutNever<{
	// If T[K] is readonly, make it ValueSetterReadonly, otherwise make it ValueSetterPair
	[K in keyof T]?: IfEquals<
		{ [Q in K]: T[K] },
		{ -readonly [Q in K]: T[K] },
		ValueSetter<T[K]>,
		never
	>;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetContextReturn<T extends Record<string, any>> = Writable<T>;

export type Defaults<T extends Record<string, unknown>> = {
	[K in keyof T]?: T[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reactiveContext<T extends Record<string, any>>(defaults?: Defaults<T>) {
	const initialContext = uniqueContext<GetContextReturn<T>>();

	const setContext = (setters?: ValueSetters<T>) => {
		const keys = joinKeys<keyof T>(defaults ?? {}, setters ?? {});

		const store = writable(
			keys.reduce((acc, key) => {
				if (defaults?.[key] !== undefined) {
					acc[key] = defaults[key] as T[keyof T];
				}

				return acc;
			}, {} as T)
		);

		const set = (v: Partial<T>) => {
			const keys = joinKeys<keyof T>(defaults ?? {}, v ?? {});

			const withDefaults = keys.reduce((acc, key) => {
				acc[key] = (v[key] === undefined ? defaults?.[key] : v[key]) as T[keyof T];
				return acc;
			}, {} as T);

			store.set(withDefaults);
		};

		const update = (updater: (state: T) => Partial<T>) => {
			store.update((v) => {
				const newState = updater(v);
				const keys = joinKeys<keyof T>(defaults ?? {}, newState ?? {});
				const withDefaults = keys.reduce((acc, key) => {
					if (newState[key] === undefined && defaults?.[key] !== undefined) {
						acc[key] = defaults[key] as T[keyof T];
					} else {
						acc[key] = newState[key] as T[keyof T];
					}
					return acc;
				}, {} as T);

				objectEntries(withDefaults).forEach(([key, value]) => {
					if (setters) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const setter = key in setters ? (setters[key] as any) : undefined;
						setter?.(value);
					}
				});
				return withDefaults;
			});
		};

		const contextStore = {
			...store,
			set,
			update,
		};

		initialContext.setContext(contextStore);

		return contextStore;
	};

	return { ...initialContext, setContext, defaults };
}
