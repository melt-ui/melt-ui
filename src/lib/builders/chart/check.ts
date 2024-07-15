import { createChart } from './create.js';
import type { Readable } from 'svelte/store';
import type { DomainContinuous, DomainContinuousBound, DomainDiscrete, DomainDiscreteSet } from './types-basic.js';
import { scalerFactoryBand, scalerFactoryLinear } from './scale.js';
import { h_linear, h_range } from './cardinal.js';
import type { InferStoreInner, ReplaceLeafType } from './types-util.js';
import { tuple } from './util.js';

type IsEqual<A,B> = [A] extends [B] ? true : false;
type Contains<C, M> = M extends keyof C ? true : false;
type Assert<C,V extends C> = V;

const ndata  = [
	{ year: '2016', apples: 10 },
	{ year: '2018', apples: 11 }
];

type Row = { year: string, apples: number };
const rdata: Row[] = ndata;

const meta = {
	myMeta: 'hello world'
}

const complexReturn = tuple(1,2,{a: 1, b: 2, c: [3,4,5]});


{
	const result = createChart({
		data: rdata,
		meta: meta,
		width: 0,
		height: 0,
		dimensions: {
			x: {
				discrete: true,
				accessor: 'year',
				scalerFactory: scalerFactoryBand<string>
			},
			y: {
				accessor: 'apples',
				...h_linear
			},
			complex: {
				accessor: (row, { meta }) => complexReturn,
				scalerFactory: scalerFactoryLinear<number>	
			}
		}
	});

	type HasX = Assert<Contains<typeof result.dimensions, 'x'>, true>;
	type HasY = Assert<Contains<typeof result.dimensions, 'y'>, true>;
	type HasZ = Assert<Contains<typeof result.dimensions, 'z'>, false>;
	type HasR = Assert<Contains<typeof result.dimensions, 'r'>, false>;

	type HasMeta = Assert<IsEqual<typeof result.meta, Readable<typeof meta>>, true>
	
	//type A = typeof result.dimensions.complex.scaled_d;
	//const a: A = null!;
	//
	//type B = InferStoreInner<A>;
	//const b: B = null!;
	//
	//type C = ReturnType<B>
	//const c: C = null!;
	//
	//type R = ReplaceLeafType<typeof complexReturn, string>;
	//const r: R = null!;

	type XDiscrete = Assert<IsEqual<typeof result.dimensions.x.discrete, true>, true>;
	type XAccessorInput = Assert<IsEqual<Parameters<InferStoreInner<typeof result.dimensions.x.accessor_d>>, [Row, { meta: typeof meta }]>, true>;
	type XAccessorReturn = Assert<IsEqual<ReturnType<InferStoreInner<typeof result.dimensions.x.accessor_d>>, string>, true>;
	type XDomain = Assert<IsEqual<InferStoreInner<typeof result.dimensions.x.domain>, DomainDiscrete<string, typeof meta> | undefined>, true>
	type XDomainD = Assert<IsEqual<InferStoreInner<typeof result.dimensions.x.domain_d>, DomainDiscreteSet<string>>, true>
	type XScaledD = Assert<IsEqual<ReturnType<InferStoreInner<typeof result.dimensions.x.scaled_d>>, number>, true>

	type YDiscrete = Assert<IsEqual<typeof result.dimensions.y.discrete, false | undefined>, true>;
	type YAccessorInput = Assert<IsEqual<Parameters<InferStoreInner<typeof result.dimensions.y.accessor_d>>, [Row, { meta: typeof meta }]>, true>;
	type YAccessorReturn = Assert<IsEqual<ReturnType<InferStoreInner<typeof result.dimensions.y.accessor_d>>, number>, true>;
	type YDomain = Assert<IsEqual<InferStoreInner<typeof result.dimensions.y.domain>, DomainContinuous<number, typeof meta> | undefined>, true>

	type HasDefaultXScaler = Assert<Contains<InferStoreInner<typeof result.dimensions.x.scaler_d>, 'bandwidth'>, true>;
	type HasDefaultYScaler = Assert<Contains<InferStoreInner<typeof result.dimensions.y.scaler_d>, 'interpolate'>, true>;

	type ComplexDiscrete = Assert<IsEqual<typeof result.dimensions.complex.discrete, true>, false>;
	type ComplexAccessorInput = Assert<IsEqual<Parameters<InferStoreInner<typeof result.dimensions.complex.accessor_d>>, [Row, { meta: typeof meta }]>, true>;
	type ComplexAccessorReturn = Assert<IsEqual<ReturnType<InferStoreInner<typeof result.dimensions.complex.accessor_d>>, typeof complexReturn>, true>;
	type ComplexDomain = Assert<IsEqual<InferStoreInner<typeof result.dimensions.complex.domain>, DomainContinuous<number, typeof meta> | undefined>, true>
	type ComplexDomainD = Assert<IsEqual<InferStoreInner<typeof result.dimensions.complex.domain_d>, DomainContinuousBound<number> | undefined>, true>
	type ComplexScaledD = Assert<IsEqual<ReturnType<InferStoreInner<typeof result.dimensions.complex.scaled_d>>, typeof complexReturn>, true>
	
}
