// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { effect, isWritable } from '$lib/internal/helpers/index.js';
import { dequal } from 'dequal';
import type { Readable, Writable } from 'svelte/store';
import type { ReadableValue } from './internal/types.js';

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

export function createSync<Stores extends Record<string, Readable<unknown> | Writable<unknown>>>(
	stores: Stores
) {
	let setters = {} as {
		[K in keyof Stores]?: (value: ReadableValue<Stores[K]>) => void;
	};
	keys(stores).forEach((key) => {
		const store = stores[key];
		effect(store, (value) => {
			if (key in setters) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setters[key]?.(value as any);
			}
		});
	});

	return keys(stores).reduce(
		(acc, key) => {
			type Value = ReadableValue<Stores[typeof key]>;
			return {
				...acc,
				[key]: function sync(value: Value, setter?: (value: Value) => void) {
					const store = stores[key];
					if (isWritable(store)) {
						store.update((p) => {
							if (dequal(p, value)) return p;
							return value;
						});
					}
					if (setter) {
						setters = { ...setters, [key]: setter };
					}
				},
			};
		},
		{} as {
			[K in keyof Stores]: (
				value: ReadableValue<Stores[K]>,
				setter?: (value: ReadableValue<Stores[K]>) => void
			) => void;
		}
	);
}
