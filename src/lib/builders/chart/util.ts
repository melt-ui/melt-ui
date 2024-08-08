import { type Readable, writable } from 'svelte/store';
import type { Dimension, DimensionContinuous, DimensionDiscrete } from './types-create.js';
import type { DomainFieldRecord, Scale } from './types-basic.js';
import type { Dimension_Describe } from './types-describe.js';
import * as Domain from 'node:domain';

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
	}
>(
	dimensions: DIMENSIONS,
	name: string,
): DIMENSIONS[keyof DIMENSIONS & string];

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
	NAME extends keyof DIMENSIONS & string
>(
	dimensions: DIMENSIONS,
	name: NAME,
	sub: string
): Omit<DIMENSIONS[NAME], 'get' | 'get_scaled' | 'get_sub' | 'get_sub_scaled'> & {
	get: DIMENSIONS[NAME]['get_sub'][keyof DIMENSIONS[NAME]['get_sub'] & string],
	get_scaled: DIMENSIONS[NAME]['get_sub_scaled'][keyof DIMENSIONS[NAME]['get_sub_scaled'] & string]
};

export function get_dimension<
	DIMENSIONS extends {
		[k: string]: Dimension<any, any, any, any, any, any>
	}
>(
	dimensions: DIMENSIONS,
	name: string,
	sub: string
): Omit<DIMENSIONS[keyof DIMENSIONS & string], 'get' | 'get_scaled' | 'get_sub' | 'get_sub_scaled'> & {
	get: DIMENSIONS[keyof DIMENSIONS & string]['get_sub'][keyof DIMENSIONS[keyof DIMENSIONS & string]['get_sub'] & string],
	get_scaled: DIMENSIONS[keyof DIMENSIONS & string]['get_sub_scaled'][keyof DIMENSIONS[keyof DIMENSIONS & string]['get_sub_scaled'] & string]
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
		if (Object.hasOwn(dimensions[name].get_sub, sub))
			throw new Error('dimension does not exist');

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

export function is_date(value: any): value is Date {
	return !!value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

export function is_domain_leaf<DOMAINTYPE>(value: DomainFieldRecord<DOMAINTYPE> | DOMAINTYPE): value is DOMAINTYPE {
	return is_date(value);
}