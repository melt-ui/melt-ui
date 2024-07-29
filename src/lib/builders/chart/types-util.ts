import type { Readable } from 'svelte/store';
import type { Dimension_MaybeStores, DimensionAccessors_MaybeStores } from './types-describe.js';

export type StoreOrType<TYPE> = TYPE | Readable<TYPE>;

export type StringValue = { toString(): string };

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

// TODO: Use these to avoid retrying in create
export type InferGeneratorReturn<GENERATOR> = GENERATOR extends Generator<any, infer R, any> ? R : never;

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

