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

//export type ChartBasicsCreated<ROW, META> = {
//	area: Area;
//	meta: META;
//	data: ROW[];
//	width: number;
//	height: number;
//	margin: Sides | number | undefined;
//	padding: Sides | number | undefined;
//}

export type ChartBasicsCreated_Stores<ROW, META> = {
	area: Readable<Area>;
	meta: Readable<META>;
	data: Readable<ROW[]>;
	width: Readable<number>;
	height: Readable<number>;
	margin: Readable<Sides | number | undefined>;
	padding: Readable<Sides | number | undefined>;
}

//export type DimensionAccessorsDerived<ROW, META, DOMAINTYPE> = {
//	get_d: AccessorFunc<ROW, META, DOMAINTYPE>;
//	get_sub_d: {
//		[k: string]: AccessorFunc<ROW, META, DOMAINTYPE>;
//	}
//}

export type DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> = {
	get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	get_sub_d: {
		[k: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
	}
}

//export type DimensionRangeDerived<RANGETYPE> = {
//	range_d: RangeList<RANGETYPE> | undefined;
//}

export type DimensionRangeDerived_Stores<RANGETYPE> = {
	range_d: Readable<RangeList<RANGETYPE> | undefined>;
}

//export type DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> = {
//	scale_d: SCALER;
//	get_scaled_d: AccessorFunc<ROW, META, RANGETYPE>;
//	get_sub_scaled_d: Record<string, AccessorFunc<ROW, META, RANGETYPE>>;
//}

export type DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> = {
	scale_d: Readable<SCALER>;
	get_scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
	get_sub_scaled_d: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
}

//export type DimensionDiscreteDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
//	DimensionRangeDerived<RANGETYPE> &
//	DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> &
//	{
//		discrete: true;
//		extents_d: ExtentsDiscreteSet<DOMAINTYPE>;
//		domain_d: DomainDiscreteSet<DOMAINTYPE>;
//	}

export type DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: true;
		extents_d: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain_d: Readable<DomainDiscreteSet<DOMAINTYPE>>;
	}

//export type DimensionContinuousDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	DimensionAccessorsDerived<ROW, META, DOMAINTYPE> &
//	DimensionRangeDerived<RANGETYPE> &
//	DimensionScaleDerived<ROW, META, RANGETYPE, SCALER> &
//	{
//		discrete: false;
//		extents_d: undefined | ExtentsContinuousBound<DOMAINTYPE>;
//		domain_d: undefined | DomainContinuousBound<DOMAINTYPE>;
//	}

export type DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	DimensionAccessorsDerived_Stores<ROW, META, DOMAINTYPE> &
	DimensionRangeDerived_Stores<RANGETYPE> &
	DimensionScaleDerived_Stores<ROW, META, RANGETYPE, SCALER> &
	{
		discrete: false;
		extents_d: Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>;
		domain_d: Readable<undefined | DomainContinuousBound<DOMAINTYPE>>
	}

//export type DimensionDerived<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	CombineObjects<
//		DimensionDiscreteDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
//		DimensionContinuousDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
//	>;
//
//export type DimensionDerived_Stores<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	CombineObjects<
//		DimensionDiscreteDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
//		DimensionContinuousDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
//	>;

//export type DimensionCreated1<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	CombineObjects<
//		DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
//		DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
//	> &
//	DimensionDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;
//
//export type DimensionCreated_Stores1<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	CombineObjects<
//		DimensionDiscrete_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>,
//		DimensionContinuous_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
//	> &
//	DimensionDerived_Stores<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>;

//export type DimensionCreated<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
//	{
//		// inputs
//		get: Accessor<ROW, META, DOMAINTYPE>;
//		get_sub: Record<string, Accessor<ROW, META, DOMAINTYPE>>;
//		range: Range<RANGETYPE, META> | undefined;
//		reverse: Reverse<META> | undefined;
//		discrete: true | false | undefined;
//		extents: ExtentsDiscrete<DOMAINTYPE, META> | ExtentsContinuous<DOMAINTYPE, META> | undefined;
//		extentsDefault: ExtentsContinuousBound<DOMAINTYPE> | undefined;
//		domain: DomainDiscrete<DOMAINTYPE, META> | DomainContinuous<DOMAINTYPE, META> | undefined;
//		sort: SortFunc<DOMAINTYPE> | undefined;
//		scaleFactory: ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER> | ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>;
//
//		// derived
//		//discrete: true | false;
//		get_d: AccessorFunc<ROW, META, DOMAINTYPE>;
//		get_sub_d: Record<string, AccessorFunc<ROW, META, DOMAINTYPE>>;
//		range_d: RangeList<RANGETYPE> | undefined;
//		scale_d: SCALER;
//		get_scaled_d: AccessorFunc<ROW, META, RANGETYPE>;
//		get_sub_scaled_d: Record<string, AccessorFunc<ROW, META, RANGETYPE>>;
//		extents_d: ExtentsDiscreteSet<DOMAINTYPE> | ExtentsContinuousBound<DOMAINTYPE> | undefined;
//		domain_d: DomainDiscreteSet<DOMAINTYPE> | DomainContinuousBound<DOMAINTYPE> | undefined;
//	};

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

//type A = DimensionCreated_Stores1<any,any,any,any,any,any>;
//type B = DimensionCreated_Stores<any,any,any,any,any,any>;
//type Ax = A['domain'];
//type Bx = B['domain'];