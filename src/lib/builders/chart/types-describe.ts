import type {
	Accessor,
	DomainContinuous,
	DomainDiscrete,
	ExtentsContinuous,
	ExtentsContinuousBound,
	ExtentsDiscrete,
	Range,
	Reverse,
	Scaler,
	ScalerFactoryContinuous,
	ScalerFactoryDiscrete,
	Sides,
	SortFunc,
} from './types-basic.js';
import type { StoreOrType } from './types-util.js';
import type { Readable } from 'svelte/store';

export type ChartBasicsMeta<META> =
	object |
	{ meta: META }

export type ChartBasicsMeta_MaybeStores<META> =
	object |
	{ meta: StoreOrType<META> }

export type ChartBasicsMeta_Stores<META> =
	{ meta: Readable<META> }

export type ChartBasics<ROW, META> =
	ChartBasicsMeta<META> &
	{
		data: ROW[];
		width: number;
		height: number;
		margin?: Sides | number;
		padding?: Sides | number;
	}

export type ChartBasics_MaybeStores<ROW, META> =
	ChartBasicsMeta_MaybeStores<META> &
	{
		data: StoreOrType<ROW[]>;
		//meta?: META; // A chart should either have meta or not have meta, never either
		width: StoreOrType<number>;
		height: StoreOrType<number>;
		margin?: StoreOrType<Sides | number | undefined>;
		padding?: StoreOrType<Sides | number | undefined>;
	}


export type ChartBasics_Stores<ROW, META> =
	ChartBasicsMeta_Stores<META> &
	{
		data: Readable<ROW[]>;
		//meta?: META; // A chart should either have meta or not have meta, never either
		width: Readable<number>;
		height: Readable<number>;
		margin?: Readable<Sides | number | undefined>;
		padding?: Readable<Sides | number | undefined>;
	}

export type DimensionAccessors<ROW, META, DOMAINTYPE> =
	{
		accessor:
			Accessor<ROW, META, DOMAINTYPE>
	} |
	{
		accessors: Record<string, Accessor<ROW, META, DOMAINTYPE>>
	}

export type DimensionAccessors_MaybeStores<ROW, META, DOMAINTYPE> =
	{
		accessor:
			StoreOrType<Accessor<ROW, META, DOMAINTYPE>>
	} |
	{
		accessors:
			Record<string, StoreOrType<Accessor<ROW, META, DOMAINTYPE>>>
	}

export type DimensionAccessors_Stores<ROW, META, DOMAINTYPE> =
	{
		accessor:
			Readable<Accessor<ROW, META, DOMAINTYPE>>
	} |
	{
		accessors:
			Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>
	}


export type DimensionRange<META, RANGETYPE> = {
	range?: Range<RANGETYPE, META>;
	reverse?: Reverse<META>;
}

export type DimensionRange_MaybeStores<META, RANGETYPE> = {
	range?: StoreOrType<Range<RANGETYPE, META> | undefined>;
	reverse?: StoreOrType<Reverse<META> | undefined>;
}

export type DimensionRange_Stores<META, RANGETYPE> = {
	range?: Readable<Range<RANGETYPE, META> | undefined>;
	reverse?: Readable<Reverse<META> | undefined>;
}

export type DimensionDiscrete<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors<ROW, META, DOMAINTYPE> &
	DimensionRange<META, RANGETYPE> &
	{
		discrete: true;
		extents?: ExtentsDiscrete<DOMAINTYPE, META>;
		domain?: DomainDiscrete<DOMAINTYPE, META>;
		sort?: SortFunc<DOMAINTYPE>;
		scalerFactory: ScalerFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>;
	}

export type DimensionDiscrete_MaybeStores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_MaybeStores<ROW, META, DOMAINTYPE> &
	DimensionRange_MaybeStores<META, RANGETYPE> &
	{
		discrete: true;
		extents?: StoreOrType<ExtentsDiscrete<DOMAINTYPE, META> | undefined>;
		domain?: StoreOrType<DomainDiscrete<DOMAINTYPE, META> | undefined>;
		sort?: StoreOrType<SortFunc<DOMAINTYPE> | undefined>;
		scalerFactory: StoreOrType<ScalerFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type DimensionDiscrete_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_Stores<ROW, META, DOMAINTYPE> &
	DimensionRange_Stores<META, RANGETYPE> &
	{
		discrete: true;
		extents?: Readable<ExtentsDiscrete<DOMAINTYPE, META> | undefined>;
		domain?: Readable<DomainDiscrete<DOMAINTYPE, META> | undefined>;
		sort?: Readable<SortFunc<DOMAINTYPE> | undefined>;
		scalerFactory: Readable<ScalerFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type DimensionContinuous<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors<ROW, META, DOMAINTYPE> &
	DimensionRange<META, RANGETYPE> &
	{
		discrete?: false;
		extents?: ExtentsContinuous<DOMAINTYPE, META>;
		extentsDefault?: ExtentsContinuousBound<DOMAINTYPE>;
		domain?: DomainContinuous<DOMAINTYPE, META>;
		scalerFactory: ScalerFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>;
	}

export type DimensionContinuous_MaybeStores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_MaybeStores<ROW, META, DOMAINTYPE> &
	DimensionRange_MaybeStores<META, RANGETYPE> &
	{
		discrete?: false;
		extents?: StoreOrType<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
		extentsDefault?: StoreOrType<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain?: StoreOrType<DomainContinuous<DOMAINTYPE, META> | undefined>;
		scalerFactory: StoreOrType<ScalerFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type DimensionContinuous_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors_Stores<ROW, META, DOMAINTYPE> &
	DimensionRange_Stores<META, RANGETYPE> &
	{
		discrete?: false;
		extents?: Readable<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
		extentsDefault?: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain?: Readable<DomainContinuous<DOMAINTYPE, META> | undefined>;
		scalerFactory: Readable<ScalerFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
	}

export type Dimension<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> |
	DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;

export type Dimension_MaybeStores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionDiscrete_MaybeStores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> |
	DimensionContinuous_MaybeStores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;

export type Dimension_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionDiscrete_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> |
	DimensionContinuous_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;


