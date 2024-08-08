import type {
	Accessor,
	AccessorFunc,
	Area,
	DomainContinuous,
	DomainContinuousBound,
	DomainDiscrete,
	DomainDiscreteSet,
	ExtentsContinuous,
	ExtentsContinuousBound,
	ExtentsDiscrete,
	ExtentsDiscreteSet,
	Range,
	RangeList,
	Reverse,
	Scale,
	ScaleFactoryContinuous,
	ScaleFactoryDiscrete,
	Sides,
	SortFunc,
} from './types-basic.js';
import type { Readable } from 'svelte/store';

export type ChartBasicsCreated_Stores<ROW, META> = {
	area: Readable<Area>;
	meta: Readable<META>;
	data: Readable<ROW[]>;
	width: Readable<number>;
	height: Readable<number>;
	margin: Readable<Sides | number | undefined>;
	padding: Readable<Sides | number | undefined>;
}

export type DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> = {
	get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	get_sub_d: {
		[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	}
}

export type DimensionRangeDerived_Stores<RANGETYPE> = {
	range_d: Readable<RangeList<RANGETYPE> | undefined>;
}

export type DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> = {
	scale_d: Readable<SCALER>;
	get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
	get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
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

export type DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: false;
		extents_d: Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>;
		domain_d: Readable<undefined | DomainContinuousBound<DOMAINTYPE>>
	}

export type DimensionDiscreteCreated_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: true;

		// inputs
		get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
		range: Readable<Range<RANGETYPE, META> | undefined>;
		reverse: Readable<Reverse<META> | undefined>;
		extents: Readable<ExtentsDiscrete<DOMAINTYPE, META> | undefined>;
		//extentsDefault: undefined;
		domain: Readable<DomainDiscrete<DOMAINTYPE, META> | undefined>;
		sort: Readable<SortFunc<DOMAINTYPE> | undefined>;
		scaleFactory: Readable<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;

		// derived
		get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub_d: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range_d: Readable<RangeList<RANGETYPE> | undefined>;
		scale_d: Readable<SCALER>;
		get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>>;
	};

export type DimensionContinuousCreated_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: false;

		// inputs
		get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
		range: Readable<Range<RANGETYPE, META> | undefined>;
		reverse: Readable<Reverse<META> | undefined>;
		extents: Readable<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
		extentsDefault: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined> | undefined;
		domain: Readable<DomainContinuous<DOMAINTYPE, META> | undefined>;
		//sort: undefined;
		scaleFactory: Readable<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;

		// derived
		//discrete: true | false;
		get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub_d: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range_d: Readable<RangeList<RANGETYPE> | undefined>;
		scale_d: Readable<SCALER>;
		get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents_d: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain_d: Readable<DomainContinuousBound<DOMAINTYPE> | undefined>;
	};

export type DimensionCreated_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: true | false;

		// inputs
		get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
		range: Readable<Range<RANGETYPE, META> | undefined>;
		reverse: Readable<Reverse<META> | undefined>;
		extents: Readable<ExtentsDiscrete<DOMAINTYPE, META> | undefined> | Readable<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
		extentsDefault?: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined> | undefined;
		domain: Readable<DomainDiscrete<DOMAINTYPE, META> | undefined> | Readable<DomainContinuous<DOMAINTYPE, META> | undefined>;
		sort?: Readable<SortFunc<DOMAINTYPE> | undefined> | undefined;
		scaleFactory: Readable<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>> | Readable<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;

		// derived
		get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub_d: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range_d: Readable<RangeList<RANGETYPE> | undefined>;
		scale_d: Readable<SCALER>;
		get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>> | Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>> | Readable<DomainContinuousBound<DOMAINTYPE> | undefined>;
	};
