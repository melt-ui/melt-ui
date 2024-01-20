import { derived, type Readable } from 'svelte/store';

type StoresObj = Record<string, Readable<unknown>>;
type StoresObjValues<S extends StoresObj> = {
	[K in keyof S as `$${K extends string ? K : never}`]: S[K] extends Readable<infer U> ? U : never;
};

export function derivedFromObject<
	S extends StoresObj,
	Callback extends (values: StoresObjValues<S>) => unknown,
>(stores: S, fn: Callback): Readable<ReturnType<Callback>> {
	return derived(Object.values(stores), (values) => {
		// map the values back to the keys
		const valuesObj = Object.fromEntries(
			Object.keys(stores).map((key, i) => [`$${key}`, values[i]])
		) as StoresObjValues<S>;
		return fn(valuesObj) as ReturnType<typeof fn>;
	});
}
