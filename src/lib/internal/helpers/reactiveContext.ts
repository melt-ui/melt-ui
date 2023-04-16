import { writable, type Writable } from 'svelte/store';

import { objectEntries } from './object';
import { uniqueContext } from './uniqueContext';
import type { IfEquals } from '../types';

type ValueSetterPair<T> = [T, (v: T) => void];
type ValueSetterReadonly<T> = [T];

type ValueSetters<T> = {
	// If T[K] is readonly, make it ValueSetterReadonly, otherwise make it ValueSetterPair
	[K in keyof T]: IfEquals<
		{ [Q in K]: T[K] },
		{ -readonly [Q in K]: T[K] },
		ValueSetterPair<T[K]> | ValueSetterReadonly<T[K]>,
		ValueSetterReadonly<T[K]>
	>;
};

type Values<T> = {
	[K in keyof T]: T[K];
};

type GetContextReturn<T extends Record<string, unknown>> = Writable<Values<T>>;

export function reactiveContext<T extends Record<string, unknown>>() {
	const initialContext = uniqueContext<GetContextReturn<T>>();

	const setContext = (values: ValueSetters<T>) => {
		const store = writable(
			objectEntries(values).reduce((acc, [key, value]) => {
				acc[key] = value[0];
				return acc;
			}, {} as Values<T>)
		);

		const set = (v: Values<T>) => {
			store.set(v);
			objectEntries(v).forEach(([key, value]) => {
				const setter = values[key][1];
				setter?.(value);
			});
		};

		const update = (updater: (state: Values<T>) => Values<T>) => {
			store.update((v) => {
				const newState = updater(v);
				objectEntries(newState).forEach(([key, value]) => {
					const setter = values[key][1];
					setter?.(value);
				});
				return newState;
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

	return { ...initialContext, setContext };
}
