import type {
	Accessor,
	DomainContinuous,
	DomainDiscrete,
	ExtentsContinuous,
	ExtentsContinuousBound,
	ExtentsDiscrete,
	Range,
	Reverse,
	Scale,
	ScaleFactoryContinuous,
	ScaleFactoryDiscrete,
	Sides,
	SortFunc,
} from './types-basic.js';
import type { MaybeStore } from './types-util.js';

type ChartBasicsMeta_Describe<META> =
	object |
	{ meta: MaybeStore<META> }

export type ChartBasics_Describe<ROW, META> =
	ChartBasicsMeta_Describe<META> &
	{
		data: MaybeStore<ROW[]>;
		//meta?: META; // A chart should either have meta or not have meta, never either
		width: MaybeStore<number>;
		height: MaybeStore<number>;
		margin?: MaybeStore<Sides | number | undefined>;
		padding?: MaybeStore<Sides | number | undefined>;
	}

export type DimensionAccessors_Describe<ROW, META, DOMAINTYPE> =
	{
		get:
			MaybeStore<Accessor<ROW, META, DOMAINTYPE>>
	} |
	{
		get_sub:
			Record<string, MaybeStore<Accessor<ROW, META, DOMAINTYPE>>>
	}

type DimensionRange_Describe<META, RANGETYPE> = {
	range?: MaybeStore<Range<RANGETYPE, META> | undefined>;
	reverse?: MaybeStore<Reverse<META> | undefined>;
}

export type DimensionDiscrete_Describe<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_Describe<ROW, META, DOMAINTYPE> &
	DimensionRange_Describe<META, RANGETYPE> &
	{
		discrete: true;
		extents?: MaybeStore<ExtentsDiscrete<DOMAINTYPE, META> | undefined>;
		domain?: MaybeStore<DomainDiscrete<DOMAINTYPE, META> | undefined>;
		sort?: MaybeStore<SortFunc<DOMAINTYPE> | undefined>;
		scaleFactory: MaybeStore<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type DimensionContinuous_Describe<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_Describe<ROW, META, DOMAINTYPE> &
	DimensionRange_Describe<META, RANGETYPE> &
	{
		discrete?: false;
		extents?: MaybeStore<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
		extentsDefault?: MaybeStore<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain?: MaybeStore<DomainContinuous<DOMAINTYPE, META> | undefined>;
		scaleFactory: MaybeStore<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type Dimension_Describe<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionDiscrete_Describe<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> |
	DimensionContinuous_Describe<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;
