import { get_dimension, is_continuous, is_discrete } from './util.js';
import { writable } from 'svelte/store';
import type { DimensionDiscrete } from './types-create.js';

const raw = {
	// static
	discrete: true,

	// inputs
	input: {
		get: writable((row: number) => 1),
		get_sub: {  x: writable((row: number) => 2) },
		range: writable([1,2]),
		reverse: writable(undefined),
		extents: writable([]),
		//extentsDefault: undefined;
		domain: writable([]),
		sort: writable(undefined),
		scaleFactory: writable(() => () => 2)
	},

	// derived
	get: writable((row: number) => ({ a: 3 })),
	get_sub: {  x: writable((row: number) => 4), y: writable((row: number) => 10)  },
	range: writable([5,6]),
	scale: writable(() => 7),
	get_scaled: writable(() => 8),
	get_sub_scaled: { x: writable((row: number) => 9) },
	extents: writable(new Set()),
	domain: writable(new Set())
} satisfies DimensionDiscrete<number, undefined, number, number, number, () => number>;

if (is_discrete(raw)) {
	if (raw.discrete) {
		//
	}
	else {
		//
	}

	const x = raw.get;
}
else {
	if (is_continuous(raw)) {
		if (raw.discrete) {
			//
		}
		else {
			//
		}
	}
	else {
		if (raw.discrete) {
			//
		}
		else {
			//
		}
	}
}

const y = get_dimension({ raw }, 'raw', 'x' as string);
y.get