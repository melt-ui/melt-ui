import { type Readable, writable } from 'svelte/store';
import type { Dimension, DimensionContinuous, DimensionDiscrete } from './types-create.js';
import type { Scale } from './types-basic.js';

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

