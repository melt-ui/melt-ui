import type { ChartBasics, DimensionContinuous, DimensionDiscrete } from './types-describe.js';
import type { InferGeneratorReturn, InferMaybeStoreInner, MaybeStores, ReplaceLeafType, Stores } from './types-util.js';
import type { ChartBasicsDerived, DimensionContinuousDerived, DimensionDiscreteDerived } from './types-create.js';
import type {
	AccessorFunc,
	AccessorScaledOutput,
	DomainContinuousBound,
	DomainDiscreteArray,
	DomainDiscreteSet,
	DomainField,
	ExtentsContinuousBound,
	ExtentsDiscreteSet,
	RangeList,
	Scaler,
	Sides,
	Size,
} from './types-basic.js';
import { derived, type Readable, readonly, writable } from 'svelte/store';
import {
	type AccumulatorCreator,
	createAccumulatorCreatorContinuous,
	createAccumulatorCreatorDiscrete,
} from './accumulator.js';
import { makeStore, tuple } from './util.js';
import { Replace } from 'lucide-svelte';

export function createChart<
	ROW,
	META,
	DIMENSIONS extends {
		[k: string]:
			MaybeStores<
				DimensionDiscrete<ROW, META, any, any, any, any> |
				DimensionContinuous<ROW, META, any, any, any, any>
			>
	},
>(
	props:
		MaybeStores<ChartBasics<ROW>> &
		{
			meta?: META | Readable<META>
			dimensions: DIMENSIONS
		}
):
	Stores<ChartBasics<ROW>> &
	{ meta: Readable<META> } &
	Stores<ChartBasicsDerived<ROW, META>> &
	{
		dimensions: {
			[k in keyof DIMENSIONS]: (
					DIMENSIONS[k] extends MaybeStores<DimensionDiscrete<ROW, META, infer DOMAINTYPE, infer RANGETYPE, infer DOMAINSIMPLETYPE, infer SCALER>>
					? Stores<DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>
					& Stores<DimensionDiscreteDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>
					& { scaled_d: Readable<AccessorScaledOutput<ROW, META, DOMAINTYPE, RANGETYPE, InferMaybeStoreInner<DIMENSIONS[k]['accessor']>>> }
					: DIMENSIONS[k] extends MaybeStores<DimensionContinuous<ROW, META, infer DOMAINTYPE, infer RANGETYPE, infer DOMAINSIMPLETYPE, infer SCALER>>
					? Stores<DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>
					& Stores<DimensionContinuousDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>
					& { scaled_d: Readable<AccessorScaledOutput<ROW, META, DOMAINTYPE, RANGETYPE, InferMaybeStoreInner<DIMENSIONS[k]['accessor']>>> }
					: never
				) &
				{
					// maintain correct return type for accessor
					accessor_d:
						DIMENSIONS[k]['accessor'] extends keyof ROW
						? Readable<(row: ROW, info: { meta: META }) => ROW[DIMENSIONS[k]['accessor']]>
						: DIMENSIONS[k]['accessor'] extends (row: ROW, info: { meta: META }) => infer DT
						? Readable<(row: ROW, info: { meta: META }) => DT>
						: DIMENSIONS[k]['accessor'] extends Readable<infer ACCESSOR>
						? (
							ACCESSOR extends keyof ROW
							? Readable<(row: ROW, info: { meta: META }) => ROW[ACCESSOR]>
							: ACCESSOR extends (row: ROW, info: { meta: META }) => infer DT
							? Readable<(row: ROW, info: { meta: META }) => DT>
							: never
						)
						: never
					scaled_d:
						DIMENSIONS[k] extends MaybeStores<DimensionDiscrete<ROW, META, any, infer RANGETYPE, any, any>>
						? (
								DIMENSIONS[k]['accessor'] extends keyof ROW
								? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<ROW[DIMENSIONS[k]['accessor']], RANGETYPE>>
								: DIMENSIONS[k]['accessor'] extends (row: ROW, info: { meta: META }) => infer DT
								? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<DT, RANGETYPE>>
								: DIMENSIONS[k]['accessor'] extends Readable<infer ACCESSOR>
								? (
									ACCESSOR extends keyof ROW
									? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<ROW[ACCESSOR], RANGETYPE>>
									: ACCESSOR extends (row: ROW, info: { meta: META }) => infer DT
									? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<DT, RANGETYPE>>
									: never
								)
								: never
						)
						: DIMENSIONS[k] extends MaybeStores<DimensionContinuous<ROW, META, any, infer RANGETYPE, any, any>>
						? (
								DIMENSIONS[k]['accessor'] extends keyof ROW
								? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<ROW[DIMENSIONS[k]['accessor']], RANGETYPE>>
								: DIMENSIONS[k]['accessor'] extends (row: ROW, info: { meta: META }) => infer DT
								? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<DT, RANGETYPE>>
								: DIMENSIONS[k]['accessor'] extends Readable<infer ACCESSOR>
								? (
									ACCESSOR extends keyof ROW
									? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<ROW[ACCESSOR], RANGETYPE>>
									: ACCESSOR extends (row: ROW, info: { meta: META }) => infer DT
									? Readable<(row: ROW, info: { meta: META }) => ReplaceLeafType<DT, RANGETYPE>>
									: never
								)
								: never
						)
						: never
				};
		}
	}
{
	// chart basics
	const data = makeStore(props.data);
	const meta = props.meta ? makeStore(props.meta) : readonly(writable(undefined as META));
	const width = makeStore(props.width);
	const height = makeStore(props.height);
	const padding = makeStore(props.padding);
	const margin = makeStore(props.margin);

	const area_d = derived(
		[width, height, padding, margin],
		([$width, $height, $padding, $margin]) => {
			
			const size: Size = {
				width: $width,
				height: $height
			}
			
			const margin_sides: Sides = {
				top: typeof $margin === 'number' ? $margin : $margin?.top ?? 0,
				left: typeof $margin === 'number' ? $margin : $margin?.left ?? 0,
				bottom: typeof $margin === 'number' ? $margin : $margin?.bottom ?? 0,
				right: typeof $margin === 'number' ? $margin : $margin?.right ?? 0,
			}
			
			const margin_size: Size = {
				width: margin_sides.left + margin_sides.right,
				height: margin_sides.top + margin_sides.bottom,
			}
			
			const margin_outer: Size & Sides = {
				...size,
				left: 0,
				top: 0,
				bottom: size.width,
				right: size.height
			};
			
			const margin_inner: Size & Sides = {
				width: margin_outer.width - margin_size.width,
				height: margin_outer.height - margin_size.height,

				left: margin_outer.left + margin_sides.left,
				top: margin_outer.top + margin_sides.top,
				right: margin_outer.right - margin_sides.right,
				bottom: margin_outer.bottom - margin_sides.bottom,
			}

			const padding_sides: Sides = {
				top: typeof $padding === 'number' ? $padding : $padding?.top ?? 0,
				left: typeof $padding === 'number' ? $padding : $padding?.left ?? 0,
				bottom: typeof $padding === 'number' ? $padding : $padding?.bottom ?? 0,
				right: typeof $padding === 'number' ? $padding : $padding?.right ?? 0,
			}
			
			const padding_size: Size = {
				width: padding_sides.left + padding_sides.right,
				height: padding_sides.top + padding_sides.bottom,
			}
			
			const padding_outer: Size & Sides = margin_inner;
			
			const padding_inner: Size & Sides = {
				width: padding_outer.width - padding_size.width,
				height: padding_outer.height - padding_size.height,

				left: padding_outer.left + padding_sides.left,
				top: padding_outer.top + padding_sides.top,
				right: padding_outer.right - padding_sides.right,
				bottom: padding_outer.bottom - padding_sides.bottom,
			};

			return {
				...size,
				margin: {
					...margin_sides,
					...margin_size,
					inner: margin_inner,
					outer: margin_outer
				},
				padding: {
					...padding_sides,
					...padding_size,
					inner: padding_inner,
					outer: padding_outer
				},
			}
		}
	);

	function * createDimensionDiscrete<DIMENSION extends MaybeStores<DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>>(
		props: DIMENSION
	)
	: Generator<
		// yield
		Readable<ExtentsDiscreteSet<DOMAINTYPE> | AccumulatorCreator<ROW, META, ExtentsDiscreteSet<DOMAINTYPE>>>,
		// return
		Stores<DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>> &
		Stores<DimensionDiscreteDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>> &
		{ scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>> },
		// receive
		Readable<ExtentsDiscreteSet<DOMAINTYPE>>
	>
	{
		const accessor = makeStore(props.accessor);
		const range = makeStore(props.range);
		const reverse = makeStore(props.reverse);
		const sort = makeStore(props.sort);
		const extents = makeStore(props.extents);
		const domain = makeStore(props.domain);
		const scalerFactory = makeStore(props.scalerFactory);

		const accessor_d = derived(
			accessor,
			($accessor) => {
				if (typeof $accessor === 'function')
					return $accessor
				else
					return (row: ROW) => row[$accessor] as DOMAINTYPE;
			}
		);

		const checker = derived(
			[accessor_d, extents],
			([$accessor_d, $extents], set: ((value: ExtentsDiscreteSet<DOMAINTYPE> | AccumulatorCreator<ROW, META, ExtentsDiscreteSet<DOMAINTYPE>>) => void)) => {

				if (typeof $extents === 'function') {
					return meta.subscribe($meta => {
						const extents = $extents({ meta: $meta });

						if (!extents) {
							set(createAccumulatorCreatorDiscrete($accessor_d));
							return;
						}

						if (Array.isArray(extents)) {
							set(new Set(extents));
							return;
						}

						set(extents);
						return;
					})
				}

				if (!$extents) {
					set(createAccumulatorCreatorDiscrete($accessor_d));
					return;
				}

				if (Array.isArray($extents)) {
					set(new Set($extents));
					return;
				}

				set($extents);
				return;
			}
		);

		const found_extents = yield checker;

		const extents_d = derived(
			checker,
			($checker, set: ((value: ExtentsDiscreteSet<DOMAINTYPE>) => void)) => {
				if (typeof $checker === 'function') {
					return found_extents.subscribe(
						$found_extents =>
							set($found_extents)
					)
				}
				else {
					set($checker);
				}
			}
		)


		const domain_d = derived(
				[extents_d, domain, sort],
				([$extents_d, $domain, $sort], set: ((value: DomainDiscreteSet<DOMAINTYPE>) => void)) => {

					const sortArray = (domain: DomainDiscreteArray<DOMAINTYPE>) =>
						new Set<DOMAINTYPE>($sort ? [...domain].sort($sort) : domain);
					const sortSet = (domain: DomainDiscreteSet<DOMAINTYPE>) =>
						$sort ? new Set([...domain].sort($sort)) : domain;

					if (!$domain)
						return set(sortSet($extents_d));

					if (typeof $domain === 'function') {
						return meta.subscribe($meta => {
							const domain = $domain($extents_d, { meta: $meta });

							if (!domain)
								return set(sortSet($extents_d));

							if (Array.isArray(domain))
								return set(sortArray(domain));

							return set(sortSet(domain));
						})
					}

					if (Array.isArray($domain))
						return set(sortArray($domain));

					return set(sortSet($domain));
				}
		);

		const range_d = derived(
			[range, reverse],
			([$range, $reverse], set: (value: RangeList<RANGETYPE> | undefined) => void) => {

				const order = <R extends Array<unknown>>(r: R) => $reverse ? [...r].reverse() as R : r;

				if (!$range)
					return set(undefined);

				if (typeof $range !== 'function')
					return set(order($range));

				return derived(
					[area_d, meta],
					([$area_d, $meta]) =>
						order($range({ area: $area_d, meta: $meta }))
				).subscribe(set)
			}
		);

		const scaler_d = derived(
			[
				scalerFactory,
				meta,
				domain_d,
				range_d
			],
			([
				 $scalerFactory,
				 $meta,
				 $domain_d,
				 $range_d
			 ]) => {
				return $scalerFactory({
					meta: $meta as never,
					domain_d: $domain_d,
					range_d: $range_d
				})
			}
		);

		const scaled_d = derived(
			[accessor_d, scaler_d],
			([$accessor_d, $scaler_d]) => {
				return ((row: ROW, info: { meta: META }) => {
					const value = $accessor_d(row, info);

					const map = (value: DomainField<DOMAINTYPE>): DomainField<RANGETYPE> => {
						if (Array.isArray(value))
							return value.map(v => map(v))

						if (!!value && typeof value === 'object')
							return Object.fromEntries(Object.entries(value).map(([n, v]) => [n, map(v)]));

						return $scaler_d(value);
					}

					return map(value);
				})
			}
		);

		return {
			discrete: true,
			accessor,
			range,
			reverse,
			sort,
			extents,
			domain,
			scalerFactory,
			accessor_d,
			extents_d,
			domain_d,
			range_d,
			scaler_d,
			scaled_d
		}
	}

	function * createDimensionContinuous<DIMENSION extends MaybeStores<DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>>, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scaler<DOMAINSIMPLETYPE, RANGETYPE>>(
		props: DIMENSION
	)
		: Generator<
		// yield
		Readable<undefined | ExtentsContinuousBound<DOMAINTYPE> | AccumulatorCreator<ROW, META, undefined | ExtentsContinuousBound<DOMAINTYPE>>>,
		// return
		Stores<DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>> &
		Stores<DimensionContinuousDerived<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>> &
		{ scaled_d: Readable<AccessorFunc<ROW, META, RANGETYPE>> },
		// receive
		Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>
	>
	{
		const accessor = makeStore(props.accessor);
		const range = makeStore(props.range);
		const reverse = makeStore(props.reverse);
		const extents = makeStore(props.extents);
		const extentsDefault = makeStore(props.extentsDefault);
		const domain = makeStore(props.domain);
		const scalerFactory = makeStore(props.scalerFactory);

		const accessor_d = derived(
			accessor,
			($accessor) => {
				if (typeof $accessor === 'function')
					return $accessor
				else
					return (row: ROW) => row[$accessor] as DOMAINTYPE;
			}
		);

		const checker = derived(
			[accessor_d, extents, extentsDefault],
			([$accessor_d, $extents, $extentsDefault], set: ((value: undefined | ExtentsContinuousBound<DOMAINTYPE> | AccumulatorCreator<ROW, META, undefined | ExtentsContinuousBound<DOMAINTYPE>>) => void)) => {

				if (typeof $extents === 'function') {
					return meta.subscribe($meta => {
						const extents = $extents({ meta: $meta });

						if (!extents) {
							set(createAccumulatorCreatorContinuous($accessor_d, $extentsDefault));
							return;
						}

						set(extents);
						return;
					})
				}

				if (!$extents) {
					set(createAccumulatorCreatorContinuous($accessor_d, $extentsDefault));
					return;
				}

				set($extents);
				return;
			}
		);

		const found_extents = yield checker;

		const extents_d = derived(
			checker,
			($checker, set: ((value: undefined | ExtentsContinuousBound<DOMAINTYPE>) => void)) => {
				if (typeof $checker === 'function') {
					return found_extents.subscribe(
						$found_extents =>
							set($found_extents)
					)
				}
				else {
					set($checker);
				}
			}
		)

		const domain_d = derived(
			[extents_d, domain],
			([$extents_d, $domain], set: ((value: undefined | DomainContinuousBound<DOMAINTYPE>) => void)) => {

				if (!$domain)
					return set($extents_d);

				if (typeof $domain === 'function') {
					return meta.subscribe($meta => {
						const domain = $domain($extents_d, { meta: $meta });

						if (!domain)
							return set($extents_d);

						const combined = tuple(domain[0] ?? $extents_d?.[0], domain[1] ?? $extents_d?.[1]);
						if (combined[0] === undefined || combined[1] === undefined)
							return set(undefined);

						return set(combined as DomainContinuousBound<DOMAINTYPE>);
					})
				}

				const combined = tuple($domain[0] ?? $extents_d?.[0], $domain[1] ?? $extents_d?.[1]);
				if (combined[0] === undefined || combined[1] === undefined)
					return set(undefined);

				return set(combined as DomainContinuousBound<DOMAINTYPE>);
			}
		);

		const range_d = derived(
			[range, reverse],
			([$range, $reverse], set: (value: RangeList<RANGETYPE> | undefined) => void) => {

				const order = <R extends Array<unknown>>(r: R) =>
					$reverse ? [...r].reverse() as R : r;

				if (!$range)
					return set(undefined);

				if (typeof $range !== 'function')
					return set(order($range));

				return derived(
					[area_d, meta],
					([$area_d, $meta]) =>
						order($range({ area: $area_d, meta: $meta }))
				).subscribe(set)
			}
		);

		const scaler_d = derived(
			[
				scalerFactory,
				meta,
				domain_d,
				range_d
			],
			([
				 $scalerFactory,
				 $meta,
				 $domain_d,
				 $range_d
			 ]) => {
				return $scalerFactory({
					meta: $meta as never,
					domain_d: $domain_d,
					range_d: $range_d
				})
			}
		);

		const scaled_d = derived(
			[accessor_d, scaler_d],
			([$accessor_d, $scaler_d]) => {
				return ((row: ROW, info: { meta: META }) => {
					const value = $accessor_d(row, info);

					const map = (value: DomainField<DOMAINTYPE>): DomainField<RANGETYPE> => {
						if (Array.isArray(value))
							return value.map(v => map(v))

						if (!!value && typeof value === 'object')
							return Object.fromEntries(Object.entries(value).map(([n, v]) => [n, map(v)]));

						return $scaler_d(value);
					}

					return map(value);
				})
			}
		);

		return {
			discrete: false,
			accessor,
			range,
			reverse,
			extents,
			extentsDefault,
			domain,
			scalerFactory,
			accessor_d,
			extents_d,
			domain_d,
			range_d,
			scaler_d,
			scaled_d
		}
	}

	const dimensionNames = Object
		.keys(props.dimensions);

	const dimensionGenerators = Object
			.values(props.dimensions)
			.map(dim => dim.discrete ? createDimensionDiscrete(dim) : createDimensionContinuous(dim))

	const dimensionCheckers = dimensionGenerators
		.map(generator =>
			generator.next().value as
				Readable<ExtentsDiscreteSet<unknown> | AccumulatorCreator<ROW, META, ExtentsDiscreteSet<unknown>>> |
				Readable<ExtentsContinuousBound<unknown> | AccumulatorCreator<ROW, META, ExtentsContinuousBound<unknown>>>
		);

	const extents_all = derived(
		[
			...dimensionCheckers
		],
		([ ...$checkers], set: ((value: Record<string, undefined | ExtentsDiscreteSet<unknown> | ExtentsContinuousBound<unknown>>) => void)) => {
			const accumulators_all = $checkers
				.map(checker => typeof checker === 'function' ? checker() : undefined);
			const accumulators = accumulators_all
				.filter(accumulator => !!accumulator);

			// all extents are predefined, no need to parse the data?
			if (accumulators.length === 0) {
				const result = Object.fromEntries(dimensionNames.map(name => [name, undefined]));
				set(result);
				return;
			}

			// parse each row and accumulate extents
			return derived([data, meta], ([$data, $meta]) => tuple($data, $meta)).subscribe(
				([$data, $meta]) => {
					$data.forEach(
						row =>
							accumulators.forEach(accumulator => accumulator.accumulate(row, { meta: $meta }))
					);

					const result = Object.fromEntries(
						dimensionNames.map((name, i) => [name, accumulators_all[i]?.accumulated()])
					)
					set(result);
				}
			)
		}
	);

	const dimensionResults = dimensionGenerators.map(
		(generator, i) =>
			generator.next(derived(extents_all, $extents_all => $extents_all[dimensionNames[i]]) as never).value as
				InferGeneratorReturn<typeof generator>
	);


	return {
		data,
		meta,
		width,
		height,
		padding,
		margin,
		area_d,
		dimensions: Object.fromEntries(dimensionResults.map(
			(result, i) =>
				tuple(dimensionNames[i], result)
		)) as never,
	};
}
