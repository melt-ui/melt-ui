import type {
	AccessorFunc,
	Area,
	DomainContinuousBound,
	DomainDiscreteSet,
	ExtentsContinuousBound,
	ExtentsDiscreteSet,
	RangeList,
	Scaler,
} from './types-basic.js';
import type { Readable } from 'svelte/store';
import type {
	Dimension,
	Dimension_Stores,
	DimensionContinuous, DimensionContinuous_Stores,
	DimensionDiscrete,
	DimensionDiscrete_Stores,
} from './types-describe.js';
import type { CombineObjects } from './types-util.js';

export type ChartBasicsDerived<ROW, META> = {
	area_d: Area;
}

export type ChartBasicsDerived_Stores<ROW, META> = {
	area_d: Readable<Area>;
}

export type DimensionAccessorsDerived<ROW, META, DOMAINTYPE> = {
	accessor_d: AccessorFunc<ROW, META, DOMAINTYPE>;
	accessors_d: {
		[k: string]: AccessorFunc<ROW, META, DOMAINTYPE>;
	}
}

export type DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> = {
	accessor_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	accessors_d: {
		[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	}
}

export type DimensionRangeDerived<RANGETYPE> = {
	range_d: RangeList<RANGETYPE> | undefined;
}

export type DimensionRangeDerived_Stores<RANGETYPE> = {
	range_d: Readable<RangeList<RANGETYPE> | undefined>;
}

export type DimensionScalerDerived<SCALER> = {
	scaler_d: SCALER;
}

export type DimensionScalerDerived_Stores<SCALER> = {
	scaler_d: Readable<SCALER>;
}

export type DimensionDiscreteDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived<RANGETYPE> &
	DimensionScalerDerived<SCALER> &
	{
		discrete: true;
		extents_d: ExtentsDiscreteSet<DOMAINTYPE>;
		domain_d: DomainDiscreteSet<DOMAINTYPE>;
	}

export type DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScalerDerived_Stores<SCALER> &
	{
		discrete: true;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>>;
	}

export type DimensionContinuousDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived<RANGETYPE> &
	DimensionScalerDerived<SCALER> &
	{
		discrete: false;
		extents_d: undefined | ExtentsContinuousBound<DOMAINTYPE>;
		domain_d: undefined | DomainContinuousBound<DOMAINTYPE>;
	}

export type DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScalerDerived_Stores<SCALER> &
	{
		discrete: false;
		extents_d: Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>;
		domain_d: Readable<undefined | DomainContinuousBound<DOMAINTYPE>>
	}

export type DimensionDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscreteDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuousDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	>;

export type DimensionDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	>;

export type DimensionCreated<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	> &
	DimensionDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;

export type DimensionCreated_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscrete_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuous_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	> &
	DimensionDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;
