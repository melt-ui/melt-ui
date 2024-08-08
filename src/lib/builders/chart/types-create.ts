import type {
	AccessorFunc,
	Area,
	DomainContinuousBound,
	DomainDiscreteSet,
	ExtentsContinuousBound,
	ExtentsDiscreteSet,
	RangeList,
	Scale, Sides,
} from './types-basic.js';
import type { Readable } from 'svelte/store';
import type {
	DimensionContinuous,
	DimensionContinuous_Stores,
	DimensionDiscrete,
	DimensionDiscrete_Stores,
} from './types-describe.js';
import type { CombineObjects, MaybeStore } from './types-util.js';

export type ChartBasicsCreated<ROW, META> = {
	area: Area;
	meta: META;
	data: ROW[];
	width: number;
	height: number;
	margin: Sides | number | undefined;
	padding: Sides | number | undefined;
}

export type ChartBasicsCreated_Stores<ROW, META> = {
	area: Readable<Area>;
	meta: MaybeStore<META>;
	data: MaybeStore<ROW[]>;
	width: MaybeStore<number>;
	height: MaybeStore<number>;
	margin: MaybeStore<Sides | number | undefined>;
	padding: MaybeStore<Sides | number | undefined>;
}

export type DimensionAccessorsDerived<ROW, META, DOMAINTYPE> = {
	get_d: AccessorFunc<ROW, META, DOMAINTYPE>;
	get_sub_d: {
		[k: string]: AccessorFunc<ROW, META, DOMAINTYPE>;
	}
}

export type DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> = {
	get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	get_sub_d: {
		[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	}
}

export type DimensionRangeDerived<RANGETYPE> = {
	range_d: RangeList<RANGETYPE> | undefined;
}

export type DimensionRangeDerived_Stores<RANGETYPE> = {
	range_d: Readable<RangeList<RANGETYPE> | undefined>;
}

export type DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> = {
	scale_d: SCALER;
	get_scaled_d: AccessorFunc<ROW, META, RANGETYPE>;
	get_sub_scaled_d: Record<string, AccessorFunc<ROW, META, RANGETYPE>>;
}

export type DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> = {
	scale_d: Readable<SCALER>;
	get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
	get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
}

export type DimensionDiscreteDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived<RANGETYPE> &
	DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: true;
		extents_d: ExtentsDiscreteSet<DOMAINTYPE>;
		domain_d: DomainDiscreteSet<DOMAINTYPE>;
	}

export type DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: true;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>>;
	}

export type DimensionContinuousDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived<RANGETYPE> &
	DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: false;
		extents_d: undefined | ExtentsContinuousBound<DOMAINTYPE>;
		domain_d: undefined | DomainContinuousBound<DOMAINTYPE>;
	}

export type DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: false;
		extents_d: Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>;
		domain_d: Readable<undefined | DomainContinuousBound<DOMAINTYPE>>
	}

export type DimensionDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscreteDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuousDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	>;

export type DimensionDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	>;

export type DimensionCreated<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	> &
	DimensionDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;

export type DimensionCreated_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	CombineObjects<
		DimensionDiscrete_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
		DimensionContinuous_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
	> &
	DimensionDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;