import { writable, type Writable } from 'svelte/store';

import { objectEntries, objectKeys } from './object';
import { uniqueContext } from './uniqueContext';
import type { IfEquals } from '../types';

type ValueSetter<T> = (v: T) => void;
type WithoutNever<T> = Pick<T, { [K in keyof T]: T[K] extends never ? never : K }[keyof T]>;

type ValueSetters<T> = WithoutNever<{
	// If T[K] is readonly, make it ValueSetterReadonly, otherwise make it ValueSetterPair
	[K in keyof T]: IfEquals<
		{ [Q in K]: T[K] },
		{ -readonly [Q in K]: T[K] },
		ValueSetter<T[K]> | undefined,
		never
	>;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetContextReturn<T extends Record<string, any>> = Writable<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function newReactiveContext<T extends Record<string, any>>(defaults?: Partial<T>) {
	const initialContext = uniqueContext<GetContextReturn<T>>();

	const setContext = (values?: ValueSetters<T>) => {
		const keys = new Set([...objectKeys(values ?? {}), ...objectKeys(defaults ?? {})]);
		const keysArr = [...keys] as (keyof T)[];

		const store = writable(
			keysArr.reduce((acc, key) => {
				if (defaults?.[key] !== undefined) {
					acc[key] = defaults[key] as T[keyof T];
				}

				return acc;
			}, {} as T)
		);

		const set = (v: Partial<T>) => {
			const withDefaults = keysArr.reduce((acc, key) => {
				acc[key] = (v[key] === undefined ? defaults?.[key] : v[key]) as T[keyof T];
				return acc;
			}, {} as T);

			store.set(withDefaults);
			objectEntries(withDefaults).forEach(([key, value]) => {
				if (values) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const setter = key in values ? (values[key] as any) : undefined;
					setter?.(value);
				}
			});
		};

		const update = (updater: (state: T) => Partial<T>) => {
			store.update((v) => {
				const newState = updater(v);
				const withDefaults = keysArr.reduce((acc, key) => {
					if (newState[key] === undefined && defaults?.[key] !== undefined) {
						acc[key] = defaults[key] as T[keyof T];
					} else {
						acc[key] = newState[key] as T[keyof T];
					}
					return acc;
				}, {} as T);

				objectEntries(withDefaults).forEach(([key, value]) => {
					if (values) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const setter = key in values ? (values[key] as any) : undefined;
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
