// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { get_current_component } from 'svelte/internal';
import { effect } from '$lib/internal/helpers';
import { dequal } from 'dequal';
import { type Writable, derived } from 'svelte/store';

type WritableValue<T> = T extends Writable<infer V> ? V : never;

// Type that gets a record, and adds a dollar sign to the beginning of each key
type WritableValueMap<T extends Record<string, unknown>> = {
	[K in keyof T as `${string & K}`]: WritableValue<T[K]>;
};

/**
 * Typed Object.keys
 *
 * @export
 * @template {Record<string, unknown>} T
 * @param {T} obj
 * @returns {(keyof T)[]}
 */
function keys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
	return Object.keys(obj);
}

function derivedObj<Deps extends Record<string, Writable<any>>, Return>(
	deps: Deps,
	callback: (values: WritableValueMap<Deps>) => Return,
) {
	return derived(Object.values(deps), (values) => {
		const valueMap = {} as WritableValueMap<Deps>;
		values.forEach((value: any, index: number) => {
			const key = `${
				keys(deps)[index] as string
			}` as keyof WritableValueMap<Deps>;
			valueMap[key] = value;
		});

		return callback(valueMap);
	});
}

function getCmpProps(cmp: any) {
	const props = cmp.$$.props;
	const ctx = cmp.$$.ctx;
	const cmpProps = {} as Record<string, any>;
	for (const key in props) {
		cmpProps[key] = ctx[props[key]];
	}
	return cmpProps;
}

export function createSync<States extends Record<string, Writable<any>>>(
	states: States,
) {
	const cmp = get_current_component();
	console.log(cmp);

	const $$states = derivedObj(states, (values) => values);
	let $$states_values = {} as any;
	effect($$states, (values) => {
		$$states_values = { ...values };
		const cmpProps = getCmpProps(cmp);
		console.log({ cmpProps });
		for (const key in values) {
			if (key in cmpProps) {
				const propsV = cmpProps[key];
				const stateV = values[key];
				if (!dequal(propsV, stateV)) {
					cmp.$$set?.({ ...cmpProps, [key]: stateV });
				}
			}
		}
	});

	return function sync(props: any) {
		for (const key in props) {
			if (key in $$states_values) {
				const stateV = $$states_values[key];
				const propsV = props[key];
				if (!dequal(propsV, stateV)) {
					states[key].set(propsV);
				}
			}
		}
	};
}
