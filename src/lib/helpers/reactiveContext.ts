import type { Writable } from 'svelte/store';
import { controllableState } from './controllableState';
import { objectEntries } from './object';
import { uniqueContext } from './uniqueContext';

type ValueSetterPair<T> = [T, (v: T) => void];

type ValueSetterPairs<T> = {
	[K in keyof T]: ValueSetterPair<T[K]>;
};

type Values<T> = {
	[K in keyof T]: T[K];
};

type GetContextReturn<T extends Record<string, unknown>> = {
	[K in keyof T]: Writable<T[K]>;
};

export function reactiveContext<T extends Record<string, unknown>>() {
	const initialContext = uniqueContext<GetContextReturn<T>>();

	const setContext = (values: ValueSetterPairs<T>) => {
		const writeableValues = objectEntries(values).reduce((acc, [key, value]) => {
			acc[key] = controllableState(value[0], value[1]);
			return acc;
		}, {} as GetContextReturn<T>);

		initialContext.setContext(writeableValues);

		const setContextStores = (values: Values<T>) => {
			objectEntries(values).forEach(([key, value]) => {
				writeableValues[key].set(value);
			});
		};

		return setContextStores;
	};

	return { ...initialContext, setContext };
}
