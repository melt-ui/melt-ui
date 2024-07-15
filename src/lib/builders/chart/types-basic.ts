import type { ReplaceLeafType } from './types-util.js';

export interface Sides {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface Area extends Size {
	padding: Sides & Size & {
		inner: Sides & Size;
		outer: Sides & Size;
	}
	margin: Sides & Size & {
		inner: Sides & Size;
		outer: Sides & Size;
	}
}

export type DomainField<DOMAINTYPE> = DomainFieldSingle<DOMAINTYPE> | DomainFieldArray<DOMAINTYPE> | DomainFieldRecord<DOMAINTYPE>;
export type DomainFieldSingle<DOMAINTYPE> = DOMAINTYPE;
export type DomainFieldArray<DOMAINTYPE> = DomainField<DOMAINTYPE>[];
export type DomainFieldRecord<DOMAINTYPE> = { [key: string]: DomainField<DOMAINTYPE> };

export type AccessorKey<ROW> = keyof ROW;
export type AccessorFunc<ROW, META, DOMAINTYPE> = (row: ROW, info: { meta: META }) => DomainField<DOMAINTYPE>;
export type Accessor<ROW, META, DOMAINTYPE> = AccessorKey<ROW> | AccessorFunc<ROW, META, DOMAINTYPE>;

export type RangeList<RANGETYPE> = [RANGETYPE, RANGETYPE, ...RANGETYPE[]];
export type RangeFunc<RANGETYPE, META> = (info: { area: Area, meta: META }) => RangeList<RANGETYPE>;
export type Range<RANGETYPE, META> = RangeList<RANGETYPE> | RangeFunc<RANGETYPE, META>;

export type ReverseValue = boolean;
export type ReverseFunc<META> = (info: { meta: META }) => ReverseValue;
export type Reverse<META> = ReverseValue | ReverseFunc<META>;

export type ExtentsDiscreteArray<DOMAINTYPE> = DOMAINTYPE[];
export type ExtentsDiscreteSet<DOMAINTYPE> = ReadonlySet<DOMAINTYPE>;
export type ExtentsDiscreteFunc<DOMAINTYPE, META> = (info: { meta: META }) => (ExtentsDiscreteArray<DOMAINTYPE> | ExtentsDiscreteSet<DOMAINTYPE> | undefined);
export type ExtentsDiscrete<DOMAINTYPE, META> = ExtentsDiscreteArray<DOMAINTYPE> | ExtentsDiscreteSet<DOMAINTYPE> | ExtentsDiscreteFunc<DOMAINTYPE, META>;
export type ExtentsContinuousBound<DOMAINTYPE> = [DOMAINTYPE, DOMAINTYPE];
export type ExtentsContinuousFunc<DOMAINTYPE, META> = (info: { meta: META }) => (ExtentsContinuousBound<DOMAINTYPE> | undefined);
export type ExtentsContinuous<DOMAINTYPE, META> = ExtentsContinuousBound<DOMAINTYPE> | ExtentsContinuousFunc<DOMAINTYPE, META>;

export type DomainDiscreteArray<DOMAINTYPE> = DOMAINTYPE[];
export type DomainDiscreteSet<DOMAINTYPE> = ReadonlySet<DOMAINTYPE>;
export type DomainDiscreteFunc<DOMAINTYPE, META> = (extents: ExtentsDiscreteSet<DOMAINTYPE>, info: { meta: META }) => (DomainDiscreteArray<DOMAINTYPE> | DomainDiscreteSet<DOMAINTYPE> | undefined);
export type DomainDiscrete<DOMAINTYPE, META> = DomainDiscreteArray<DOMAINTYPE> | DomainDiscreteSet<DOMAINTYPE> | DomainDiscreteFunc<DOMAINTYPE, META>;
export type DomainContinuousOptionalBound<DOMAINTYPE> = [DOMAINTYPE | undefined | null, DOMAINTYPE | undefined | null];
export type DomainContinuousBound<DOMAINTYPE> = [DOMAINTYPE, DOMAINTYPE];
export type DomainContinuousFunc<DOMAINTYPE, META> = (extents: undefined | ExtentsContinuousBound<DOMAINTYPE>, info: { meta: META }) => (DomainContinuousOptionalBound<DOMAINTYPE> | DomainContinuousBound<DOMAINTYPE> | undefined);
export type DomainContinuous<DOMAINTYPE, META> = DomainContinuousOptionalBound<DOMAINTYPE> | DomainContinuousBound<DOMAINTYPE> | DomainContinuousFunc<DOMAINTYPE, META>;

export type SortFunc<DOMAINTYPE> = (a: DOMAINTYPE, b: DOMAINTYPE) => number;

export type Scaler<DOMAINTYPE, RANGETYPE> = (value: DOMAINTYPE) => RANGETYPE;

export type ScalerFactoryDiscrete<DOMAINTYPE, RANGETYPE, META, SCALER extends Scaler<DOMAINTYPE, RANGETYPE>> = (info: { meta: META, domain_d: DomainDiscreteSet<DOMAINTYPE>, range_d: RangeList<RANGETYPE> | undefined }) => SCALER;
export type ScalerFactoryContinuous<DOMAINTYPE, RANGETYPE, META, SCALER extends Scaler<DOMAINTYPE, RANGETYPE>> = (info: { meta: META, domain_d: undefined | DomainContinuousBound<DOMAINTYPE>, range_d: RangeList<RANGETYPE> | undefined }) => SCALER;

export type AccessorScaledOutput<ROW,META,DOMAINTYPE, RANGETYPE,ACCESSOR> =
	ACCESSOR extends AccessorFunc<ROW, META, DOMAINTYPE>
		? (row: ROW, info: { meta: META }) => ReplaceLeafType<ReturnType<ACCESSOR>, RANGETYPE>
		: ACCESSOR extends keyof ROW
		? (row: ROW, info: { meta: META }) => ReplaceLeafType<ROW[ACCESSOR], RANGETYPE>
		: never;
