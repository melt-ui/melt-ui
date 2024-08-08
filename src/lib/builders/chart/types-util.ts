import type { Readable } from 'svelte/store';
import type { Dimension_Describe, DimensionAccessors_Describe } from './types-describe.js';
import type { DomainField } from './types-basic.js';

export type MaybeStore<TYPE> = TYPE | Readable<TYPE>;

export type StringValue = { toString(): string };

export type InferStoreInner<STORE> =
	STORE extends Readable<infer INNER>
		? INNER
		: never;

export type InferMaybeStoreInner<MAYBESTORE> =
	MAYBESTORE extends Readable<infer INNER>
		? INNER
		: MAYBESTORE;

export type Store<MAYBESTORE> =
	MAYBESTORE extends Readable<infer INNER>
		? MAYBESTORE
		: Readable<MAYBESTORE>;

export type ReplaceLeafType<TYPE, TO> =
	TYPE extends [...infer ELEMENTS]
	? { [K in keyof TYPE]: ReplaceLeafType<TYPE[K], TO> }
	: TYPE extends Array<infer ELEMENT>
	? Array<ReplaceLeafType<ELEMENT, TO>>
	: TYPE extends Date
	? TO
	: TYPE extends Record<string, infer MEMBER>
	? { [k in keyof TYPE]: ReplaceLeafType<TYPE[k], TO> }
	: TO;

// TODO: Use these to avoid retrying in create
export type InferGeneratorReturn<GENERATOR> = GENERATOR extends Generator<any, infer R, any> ? R : never;

export type Infer_DimensionAccessor_ReturnType<ROW, ACCESSOR> =
	ACCESSOR extends keyof ROW
		? ROW[ACCESSOR]
		: ACCESSOR extends (...args: any[]) => infer RETURNTYPE
		? RETURNTYPE
		: never;

export type Infer_DimensionAccessors_MaybeStores_ReturnType<DIMENSION extends DimensionAccessors_Describe<ROW, any, any>, ROW> =
	'get' extends keyof DIMENSION
	? Infer_DimensionAccessor_ReturnType<ROW, InferMaybeStoreInner<DIMENSION['get']>>
	: 'get_sub' extends keyof DIMENSION
	? {
			[sub in keyof DIMENSION['get_sub']]:
				Infer_DimensionAccessor_ReturnType<ROW, InferMaybeStoreInner<DIMENSION['get_sub'][sub]>>
	}
	: never

export type Infer_DimensionAccessors_MaybeStores_DomainType<DIMENSION extends DimensionAccessors_Describe<ROW, any, any>, ROW, DOMAINSIMPLETYPE> =
	Infer_DimensionAccessors_MaybeStores_ReturnType<DIMENSION, ROW> extends DomainField<infer DOMAINTYPE>
		? (
			DOMAINTYPE extends DOMAINSIMPLETYPE
			? DOMAINTYPE
			: never
		)
		: never
