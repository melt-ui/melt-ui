import type { Writable } from 'svelte/store';
import { controllableState } from './controllableState';
import { objectEntries } from './object';
import { uniqueContext } from './uniqueContext';

type Values<T> = {
	[K in keyof T]: [T[K], (v: T[K]) => void];
};

type GetContextReturn<T extends Record<string, unknown>> = {
	[K in keyof T]: Writable<T[K]>;
};

export function reactiveContext<T extends Record<string, unknown>>() {
	const initialContext = uniqueContext<GetContextReturn<T>>();

	const setContext = (values: Values<T>) => {
		const writeableValues = objectEntries(values).reduce((acc, [key, value]) => {
			acc[key] = controllableState(value[0], value[1]);
			return acc;
		}, {} as GetContextReturn<T>);

		initialContext.setContext(writeableValues);

		return writeableValues;
	};

	return { ...initialContext, setContext };
}
