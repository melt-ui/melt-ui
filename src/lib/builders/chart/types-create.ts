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

export type ChartBasics<ROW, META> = {
	area: Readable<Area>;
	meta: Readable<META>;
	data: Readable<ROW[]>;
	width: Readable<number>;
	height: Readable<number>;
	margin: Readable<Sides | number | undefined>;
	padding: Readable<Sides | number | undefined>;
}

export type DimensionDiscrete<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: true;

		// inputs
		input: {
			get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
			get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
			range: Readable<Range<RANGETYPE, META> | undefined>;
			reverse: Readable<Reverse<META> | undefined>;
			extents: Readable<ExtentsDiscrete<DOMAINTYPE, META> | undefined>;
			//extentsDefault: undefined;
			domain: Readable<DomainDiscrete<DOMAINTYPE, META> | undefined>;
			sort: Readable<SortFunc<DOMAINTYPE> | undefined>;
			scaleFactory: Readable<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
		}

		// derived
		get: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range: Readable<RangeList<RANGETYPE> | undefined>;
		scale: Readable<SCALER>;
		get_scaled: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents: Readable<ExtentsDiscreteSet<DOMAINTYPE>>;
		domain: Readable<DomainDiscreteSet<DOMAINTYPE>>;
	};

export type DimensionContinuous<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: false;

		// inputs
		input: {
			get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
			get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
			range: Readable<Range<RANGETYPE, META> | undefined>;
			reverse: Readable<Reverse<META> | undefined>;
			extents: Readable<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
			extentsDefault: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined> | undefined;
			domain: Readable<DomainContinuous<DOMAINTYPE, META> | undefined>;
			//sort: undefined;
			scaleFactory: Readable<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
		}

		// derived
		//discrete: true | false;
		get: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range: Readable<RangeList<RANGETYPE> | undefined>;
		scale: Readable<SCALER>;
		get_scaled: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain: Readable<DomainContinuousBound<DOMAINTYPE> | undefined>;
	};

export type Dimension<ROW, META, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>> =
	{
		// static
		discrete: true | false;

		// inputs
		input: {
			get: Readable<Accessor<ROW, META, DOMAINTYPE>>;
			get_sub: Record<string, Readable<Accessor<ROW, META, DOMAINTYPE>>>;
			range: Readable<Range<RANGETYPE, META> | undefined>;
			reverse: Readable<Reverse<META> | undefined>;
			extents: Readable<ExtentsDiscrete<DOMAINTYPE, META> | undefined> | Readable<ExtentsContinuous<DOMAINTYPE, META> | undefined>;
			extentsDefault?: Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined> | undefined;
			domain: Readable<DomainDiscrete<DOMAINTYPE, META> | undefined> | Readable<DomainContinuous<DOMAINTYPE, META> | undefined>;
			sort?: Readable<SortFunc<DOMAINTYPE> | undefined> | undefined;
			scaleFactory: Readable<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>> | Readable<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>;
		}

		// derived
		get: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>;
		get_sub: Record<string, Readable<AccessorFunc<ROW, META, DOMAINTYPE>>>;
		range: Readable<RangeList<RANGETYPE> | undefined>;
		scale: Readable<SCALER>;
		get_scaled: Readable<AccessorFunc<ROW, META, RANGETYPE>>;
		get_sub_scaled: Record<string, Readable<AccessorFunc<ROW, META, RANGETYPE>>>;
		extents: Readable<ExtentsDiscreteSet<DOMAINTYPE>> | Readable<ExtentsContinuousBound<DOMAINTYPE> | undefined>;
		domain: Readable<DomainDiscreteSet<DOMAINTYPE>> | Readable<DomainContinuousBound<DOMAINTYPE> | undefined>;
	};
