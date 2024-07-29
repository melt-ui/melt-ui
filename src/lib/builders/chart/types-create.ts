import type {
	AccessorFunc,
	AccessorScaledOutput,
	Area,
	DomainContinuousBound,
	DomainDiscreteSet,
	ExtentsContinuousBound,
	ExtentsDiscreteSet,
	RangeList,
	Scaler,
} from './types-basic.js';
import type { Readable } from 'svelte/store';

export type ChartBasicsDerived<ROW, META> = {
	area_d: Area;
}

export type ChartBasicsDerived_Stores<ROW, META> = {
	area_d: Readable<Area>;
}

export type DimensionBasicDerived<ROW, META, DOMAINTYPE, RANGETYPE> = {
	accessor_d: AccessorFunc<ROW, META, DOMAINTYPE>;
	scaled_d: AccessorScaledOutput<ROW, META, DOMAINTYPE, RANGETYPE, AccessorFunc<ROW, META, DOMAINTYPE>>
};

export type DimensionDiscreteDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		discrete: true;
		accessor_d: AccessorFunc<ROW, META, DOMAINTYPE>;
		accessors_d: {
			[k: string]: AccessorFunc<ROW, META, DOMAINTYPE>;
		}
		range_d: RangeList<RANGETYPE> | undefined;
		extents_d: ExtentsDiscreteSet<DOMAINTYPE>;
		domain_d: DomainDiscreteSet<DOMAINTYPE>;
		scaler_d: SCALER;
	}

export type DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		discrete: true;
		accessor_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		accessors_d: {
			[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		}
		range_d: Readable<RangeList<RANGETYPE> | undefined>;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>>;
		scaler_d: SCALER;
	}

export type DimensionContinuousDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		discrete: false;
		accessor_d: AccessorFunc<ROW, META, DOMAINTYPE>;
		accessors_d: {
			[k: string]: AccessorFunc<ROW, META, DOMAINTYPE>;
		}
		range_d: RangeList<RANGETYPE> | undefined;
		extents_d: undefined | ExtentsContinuousBound<DOMAINTYPE>;
		domain_d: undefined | DomainContinuousBound<DOMAINTYPE>;
		scaler_d: SCALER;
	}

export type DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		discrete: false;
		accessor_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		accessors_d: {
			[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		}
		range_d: Readable<RangeList<RANGETYPE> | undefined>;
		extents_d: Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>;
		domain_d: Readable<undefined | DomainContinuousBound<DOMAINTYPE>>
		scaler_d: SCALER;
	}
