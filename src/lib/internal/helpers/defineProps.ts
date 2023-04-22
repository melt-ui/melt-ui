import { objectKeys } from './object';

type DefinedObj<T> = {
	[K in keyof T]: T[K] extends undefined ? never : T[K];
};

export function defineDefaults<T extends object, D>(defaults?: D) {
	function withDefaults(props: T) {
		// Return defaults + props that are not undefined
		const definedProps = objectKeys(props).reduce((acc, key) => {
			if (props[key] !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				acc[key] = props[key] as any;
			}
			return acc;
		}, {} as DefinedObj<T>);
		return { ...defaults, ...definedProps };
	}

	return { defaults, withDefaults };
}
