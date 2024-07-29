import type { Readable } from 'svelte/store';
import type {
	Dimension,
	Dimension_MaybeStores,
	DimensionAccessors,
	DimensionAccessors_MaybeStores,
} from './types-describe.js';
import type { DomainField } from './types-basic.js';

export type StoreOrType<TYPE> = TYPE | Readable<TYPE>;

export type MaybeStore<TYPE> = TYPE | Readable<TYPE>;
export type MaybeStores<TYPE> = {
	[k in keyof TYPE] :
		k extends 'discrete'
		? TYPE[k]
		: k extends 'accessors'
		? { [a in keyof TYPE[k]]: MaybeStore<TYPE[k][a]> }
		:	MaybeStore<TYPE[k]>
}
export type Stores<TYPE> = {
	[k in keyof TYPE]-?
	: k extends 'discrete'
	? TYPE[k]
	: k extends 'accessors' | 'accessors_d'
	? { [a in keyof TYPE[k]]: Readable<TYPE[k][a]> }
	: Readable<TYPE[k]>
}
export type StringValue = { toString(): string };

export type InferMaybeAccessors<DIMENSION extends MaybeStores<DimensionAccessors<any, any, any>>> =
	'accessor' extends keyof DIMENSION
	? DIMENSION['accessor']
	: 'accessors' extends keyof DIMENSION
	? DIMENSION['accessors'][keyof DIMENSION['accessors']]
	: never;

export type InferStoreInner<STORE> =
	STORE extends Readable<infer INNER>
		? INNER
		: never;

export type InferMaybeStoreInner<MAYBESTORE> =
	MAYBESTORE extends Readable<infer INNER>
		? INNER
		: MAYBESTORE;

export type ReplaceLeafType<TYPE, TO> =
	TYPE extends [...infer ELEMENTS]
	? { [K in keyof TYPE]: ReplaceLeafType<TYPE[K], TO> }
	: TYPE extends Array<infer ELEMENT>
	? Array<ReplaceLeafType<ELEMENT, TO>>
	: TYPE extends Record<string, infer MEMBER>
	? { [k in keyof TYPE]: ReplaceLeafType<TYPE[k], TO> }
	: TO;

export type InferAccessorReturn<ROW, META, ACCESSOR> =
	InferMaybeStoreInner<ACCESSOR> extends (row: ROW, info: { meta: META }) => infer R
		? R
		: InferMaybeStoreInner<ACCESSOR> extends keyof ROW
		? ROW[InferMaybeStoreInner<ACCESSOR>]
		: never

export type MarkPartial<OBJECT,MEMBERS extends keyof OBJECT> =
	Omit<OBJECT, MEMBERS> &
	Partial<Pick<OBJECT, MEMBERS>>;

// TODO: Use these to avoid retrying in create
export type InferGeneratorReturn<GENERATOR> = GENERATOR extends Generator<any, infer R, any> ? R : never;
export type InferGeneratorYield<GENERATOR> = GENERATOR extends Generator<infer Y, any, any> ? Y : never;
export type InferGeneratorReceive<GENERATOR> = GENERATOR extends Generator<any, any, infer R> ? R : never;


export type Infer_Type_DomainType<RETURN> =
	RETURN extends DomainField<infer DOMAINTYPE>
		? DOMAINTYPE
		: never;

export type Infer_DimensionAccessor_ReturnType<ROW, ACCESSOR> =
	ACCESSOR extends keyof ROW
		? ROW[ACCESSOR]
		: ACCESSOR extends (...args: any[]) => infer RETURNTYPE
		? RETURNTYPE
		: never;

export type Infer_DimensionAccessors_MaybeStores_ReturnType<DIMENSION extends DimensionAccessors_MaybeStores<ROW, any, any>, ROW> =
	'accessor' extends keyof DIMENSION
	? Infer_DimensionAccessor_ReturnType<ROW, InferMaybeStoreInner<DIMENSION['accessor']>>
	: 'accessors' extends keyof DIMENSION
	? {
			[sub in keyof DIMENSION['accessors']]:
				Infer_DimensionAccessor_ReturnType<ROW, InferMaybeStoreInner<DIMENSION['accessors'][sub]>>
	}
	: never

export type Infer_Dimension_MaybeStores_Accessors<DIMENSION extends Dimension_MaybeStores<any, any, any, any, any, any>> =
	'accessor' extends keyof DIMENSION
	? DIMENSION['accessor']
	: 'accessors' extends keyof DIMENSION
	? DIMENSION['accessors'][keyof DIMENSION['accessors']]
	: never;

