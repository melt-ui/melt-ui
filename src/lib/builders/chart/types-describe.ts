import type {
	Accessor, DomainContinuous,
	DomainDiscrete, ExtentsContinuous, ExtentsContinuousBound,
	ExtentsDiscrete,
	Range,
	Reverse,
	Scaler, ScalerFactoryContinuous, ScalerFactoryDiscrete,
	Sides,
	SortFunc,
} from './types-basic.js';

export type ChartBasics<ROW> = {
	data: ROW[];
	//meta?: META; // A chart should either have meta or not have meta, never either
	width: number;
	height: number;
	margin?: Sides | number;
	padding?: Sides | number;
}

export type DimensionAccessors<ROW, META, DOMAINTYPE> =
	{
		accessor:
			Accessor<ROW, META, DOMAINTYPE>
	} |
	{
		accessors: Record<string, Accessor<ROW, META, DOMAINTYPE>>
	}

export type DimensionDiscrete<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors<ROW, META, DOMAINTYPE> &
	{
		discrete: true;
		range?: Range<RANGETYPE, META>;
		reverse?: Reverse<META>;
		extents?: ExtentsDiscrete<DOMAINTYPE, META>;
		domain?: DomainDiscrete<DOMAINTYPE, META>;
		sort?: SortFunc<DOMAINTYPE>;
		scalerFactory: ScalerFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>;
	}

export type DimensionContinuous<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessors<ROW, META, DOMAINTYPE> &
	{
		discrete?: false;
		range?: Range<RANGETYPE, META>;
		reverse?: Reverse<META>;
		extents?: ExtentsContinuous<DOMAINTYPE, META>;
		extentsDefault?: ExtentsContinuousBound<DOMAINTYPE>;
		domain?: DomainContinuous<DOMAINTYPE, META>;
		scalerFactory: ScalerFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>;
	}
