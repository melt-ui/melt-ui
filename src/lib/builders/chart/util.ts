import { type Readable, writable } from 'svelte/store';
import type { Dimension, DimensionContinuous, DimensionDiscrete } from './types-create.js';
import type { Scale } from './types-basic.js';
import type { Dimension_Describe } from './types-describe.js';

export function isStore<TYPE>(maybeStore: TYPE | Readable<TYPE>): maybeStore is Readable<TYPE> {
	return maybeStore && typeof maybeStore === 'object' && 'subscribe' in maybeStore;
}

export function makeStore<TYPE>(maybeStore: TYPE | Readable<TYPE>): Readable<TYPE> {
	if (isStore(maybeStore)) {
		return maybeStore;
	} else {
		return writable(maybeStore);
	}
}

export function tuple<T extends any[]>(...args: T): T {
	return args;
}

export function is_discrete<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>>(
	dimension: Dimension<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
) : dimension is DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> {
	return dimension.discrete;
}

export function is_continuous<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>>(
	dimension: Dimension<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
) : dimension is DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> {
	return !dimension.discrete;
}


export function get_dimension<
	DIMENSIONS extends {
		[k: string]: Dimension<any, any, any, any, any, any>
	},
	NAME extends keyof DIMENSIONS & string,
>(
	dimensions: DIMENSIONS,
	name: NAME,
): DIMENSIONS[NAME];

export function get_dimension<
	DIMENSIONS extends {
		[k: string]: Dimension<any, any, any, any, any, any>
	},
	NAME extends keyof DIMENSIONS & string,
	SUB extends keyof DIMENSIONS[NAME]['get_sub'] & string
>(
	dimensions: DIMENSIONS,
	name: NAME,
	sub: SUB
): Omit<DIMENSIONS[NAME], 'get' | 'get_scaled' | 'get_sub' | 'get_sub_scaled'> & {
	get: DIMENSIONS[NAME]['get_sub'][SUB],
	get_scaled: DIMENSIONS[NAME]['get_sub_scaled'][SUB]
};

export function get_dimension<
	DIMENSIONS extends {
		[k: string]: Dimension<any, any, any, any, any, any>
	},
	NAME extends keyof DIMENSIONS & string,
	SUB extends keyof DIMENSIONS[NAME]['get_sub'] & string
>(
	dimensions: DIMENSIONS,
	name: NAME,
	sub?: SUB | undefined
): any {
	if (sub !== undefined) {
		const { get_sub, get_sub_scaled, ...clone} = Object.assign(
			{},
			dimensions[name],
			{
				get_sub: dimensions[name].get_sub?.[sub],
				get_sub_scaled: dimensions[name].get_sub_scaled?.[sub],
			}
		);

		return clone;
	}
	else
		return dimensions[name];
}