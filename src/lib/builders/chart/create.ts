import { makeElement } from '$lib/internal/helpers/index.js';
import type {
	ChartBasics_Describe,
	Dimension_Describe,
	DimensionContinuous_Describe,
	DimensionDiscrete_Describe,
} from './types-describe.js';
import type {
	Infer_DimensionAccessor_ReturnType,
	Infer_DimensionAccessors_MaybeStores_DomainType,
	Infer_DimensionAccessors_MaybeStores_ReturnType,
	InferGeneratorReturn,
	ReplaceLeafType,
} from './types-util.js';
import type { ChartBasics, Dimension, DimensionContinuous, DimensionDiscrete } from './types-create.js';
import type {
	Accessor,
	AccessorFunc,
	AccessorFuncRt,
	DomainContinuousBound,
	DomainDiscreteArray,
	DomainDiscreteSet,
	DomainField,
	ExtentsContinuousBound,
	ExtentsDiscreteSet,
	Range,
	RangeList,
	Reverse,
	Scale,
	ScaleFactoryContinuous,
	ScaleFactoryDiscrete,
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
import type { MeltActionReturn } from '../../internal/types.js';
import { resizeObserver } from '../scroll-area/helpers.js';
import type { ChartEvents } from './events.js';

export function createChart<
	ROW,
	META,
	DIMENSIONS extends {
		[k: string]: Dimension_Describe<ROW, META, any, any, any, any>
	},
>(
	props:
		ChartBasics_Describe<ROW, META> &
		{
			meta?: META | Readable<META>
			dimensions: DIMENSIONS
		}
):
	ChartBasics<ROW, META> &
	{
		dimensions: Record<keyof DIMENSIONS, Dimension<ROW, META, any, any, any, any>> & {
			[k in keyof DIMENSIONS]:
				(
					DIMENSIONS[k] extends DimensionDiscrete_Describe<ROW, META, infer DOMAINTYPE, infer RANGETYPE, infer DOMAINSIMPLETYPE, infer SCALER>
					? DimensionDiscrete<ROW, META, Infer_DimensionAccessors_MaybeStores_DomainType<DIMENSIONS[k], ROW, DOMAINSIMPLETYPE>, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
					: DIMENSIONS[k] extends DimensionContinuous_Describe<ROW, META, infer DOMAINTYPE, infer RANGETYPE, infer DOMAINSIMPLETYPE, infer SCALER>
					? DimensionContinuous<ROW, META, Infer_DimensionAccessors_MaybeStores_DomainType<DIMENSIONS[k], ROW, DOMAINSIMPLETYPE>, RANGETYPE, DOMAINSIMPLETYPE, SCALER>
					: never
				) &
				(
					DIMENSIONS[k] extends Dimension_Describe<ROW, META, any, any, infer DOMAINSIMPLETYPE, any>
					? (
							'get' extends keyof DIMENSIONS[k]
							? {
								input: {
									get:
										Readable<Accessor<ROW, META, Infer_DimensionAccessors_MaybeStores_DomainType<DIMENSIONS[k], ROW, DOMAINSIMPLETYPE>>>
								}
							}
							: object
					) &
						(
							'get_sub' extends keyof DIMENSIONS[k]
							? {
								input: {
									get_sub:
										{
											[sub in keyof (DIMENSIONS[k]['get_sub'])]:
											Readable<Accessor<ROW, META, Infer_DimensionAccessors_MaybeStores_DomainType<DIMENSIONS[k], ROW, DOMAINSIMPLETYPE>>>
										}
								}
							}
							: object
					)
					: object
				) &
				{
					// maintain correct return type for get(s)
					get:
						Readable<AccessorFuncRt<ROW, META, Infer_DimensionAccessors_MaybeStores_ReturnType<DIMENSIONS[k], ROW>>>
					get_sub:
						'get_sub' extends keyof DIMENSIONS[k]
						? {
								[sub in keyof DIMENSIONS[k]['get_sub']]:
									Readable<AccessorFuncRt<ROW, META, Infer_DimensionAccessor_ReturnType<ROW, DIMENSIONS[k]['get_sub'][sub]>>>
							}
						: Record<string, never>
					get_scaled:
						DIMENSIONS[k] extends Dimension_Describe<ROW, META, any, infer RANGETYPE, any, any>
						? Readable<AccessorFuncRt<ROW, META, ReplaceLeafType<Infer_DimensionAccessors_MaybeStores_ReturnType<DIMENSIONS[k], ROW>, RANGETYPE>>>
						: never
					get_sub_scaled:
						'get_sub' extends keyof DIMENSIONS[k]
							? {
									[sub in keyof DIMENSIONS[k]['get_sub']]:
									DIMENSIONS[k] extends Dimension_Describe<ROW, META, any, infer RANGETYPE, any, any>
										? ReplaceLeafType<Infer_DimensionAccessor_ReturnType<ROW, DIMENSIONS[k]['get_sub'][sub]>, RANGETYPE>
										: never
								}
							: Record<string, never>
				};
		}
	}
{
	// chart basics
	const data = makeStore(props.data);
	const meta = props.meta ? makeStore(props.meta) : readonly(writable(undefined as META));
	const size = (props.width === undefined || props.height === undefined) ? writable<Size>({ width: 0, height: 0 }) : undefined;
	const width = props.width !== undefined ? makeStore(props.width) : derived(size!, $size => $size.width);
	const height = props.height !== undefined ? makeStore(props.height) : derived(size!, $size => $size.height);
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
				bottom: size.height,
				right: size.width
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

	function create_get_sub_d<DOMAINTYPE>(
		get: Readable<Accessor<ROW, META, DOMAINTYPE>> | undefined,
		get_sub: {
			[p: string]:
				Readable<keyof ROW | AccessorFunc<ROW, META, DOMAINTYPE>>
			} | undefined
	) {
		const get_sub_d = get_sub
			? Object.fromEntries(
				Object
					.entries(get_sub)
					.map(([name, get]) => [
						name,
						derived(
							get,
							($get) => {
								if (typeof $get === 'function')
									return $get
								else
									return (row: ROW) => row[$get] as DOMAINTYPE;
							}
						)
					])
			)
			: { };

		const get_d = get
			? derived(
				get,
				($get) => {
					if (typeof $get === 'function')
						return $get
					else
						return (row: ROW) => row[$get] as DOMAINTYPE;
				}
			)
			: Object.entries(get_sub_d).length !== 0
				? derived(
					Object.values(get_sub_d),
					($get_sub_d) => {
						const keys = Object.keys(get_sub_d);
						return (row: ROW, info: { meta: META }) => {
							return Object.fromEntries(
								keys.map((key, i) => [
									key,
									$get_sub_d[i](row, info)
								])
							)
						}
					}
				)
				: undefined;

		if (!get_d)
			throw new Error('no get_sub defined');

		return { get_d, get_sub_d };
	}

	function create_range_d<RANGETYPE>(
		range: Readable<Range<RANGETYPE, META> | undefined>,
		reverse: Readable<Reverse<META> | undefined>
	) {
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

		return range_d;
	}

	function create_get_scaled_d<DOMAINTYPE extends DOMAINSIMPLETYPE, DOMAINSIMPLETYPE, RANGETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>>(
		scaleFactory:
			Readable<ScaleFactoryDiscrete<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>> |
			Readable<ScaleFactoryContinuous<DOMAINSIMPLETYPE, RANGETYPE, META, SCALER>>,
		meta:
			Readable<META>,
		domain_d:
			Readable<DomainDiscreteSet<DOMAINTYPE>> |
			Readable<DomainContinuousBound<DOMAINTYPE> | undefined>,
		range_d:
			Readable<RangeList<RANGETYPE> | undefined>,
		get_d:
			Readable<AccessorFunc<ROW, META, DOMAINTYPE>>,
		get_sub_d:
			{ [p: string]: Readable<AccessorFunc<ROW, META, DOMAINTYPE>> }
	) {
		const scale_d = derived(
			[
				scaleFactory,
				meta,
				domain_d,
				range_d
			],
			([
				 $scaleFactory,
				 $meta,
				 $domain_d,
				 $range_d
			 ]) => {
				return $scaleFactory({
					meta: $meta as never,
					domain_d: $domain_d as never,
					range_d: $range_d
				})
			}
		);

		function create_get_scaled_d(get_d: Readable<AccessorFunc<ROW, META, DOMAINTYPE>>) {
			const get_scaled_d = derived(
				[get_d, scale_d],
				([$get_d, $scale_d]) => {
					return ((row: ROW, info: { meta: META }) => {
						const value = $get_d(row, info);

						const map = (value: DomainField<DOMAINTYPE>): DomainField<RANGETYPE> => {
							if (Array.isArray(value))
								return value.map(v => map(v))

							if (!!value && typeof value === 'object')
								return Object.fromEntries(Object.entries(value).map(([n, v]) => [n, map(v)]));

							return $scale_d(value);
						}

						return map(value);
					})
				}
			);

			return get_scaled_d;
		}

		const get_scaled_d = create_get_scaled_d(get_d)

		const get_sub_scaled_d = Object.fromEntries(
			Object
				.entries(get_sub_d)
				.map(([name, get_d]) => tuple(
					name,
					create_get_scaled_d(get_d)
				))
		);

		return {
			scale_d,
			get_scaled_d,
			get_sub_scaled_d
		}
	}

	function * createDimensionDiscrete<DIMENSION extends DimensionDiscrete_Describe<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>>(
		props: DIMENSION
	)
	: Generator<
		// yield
		Readable<ExtentsDiscreteSet<DOMAINTYPE> | AccumulatorCreator<ROW, META, ExtentsDiscreteSet<DOMAINTYPE>>>,
		// return
		DimensionDiscrete<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> &
		{
			get_scaled: Readable<AccessorFunc<ROW, META, RANGETYPE>>,
			get_sub_scaled:
				'get_sub' extends keyof DIMENSION
					? {
						[sub in keyof DIMENSION['get_sub']]:
							ReplaceLeafType<Infer_DimensionAccessor_ReturnType<ROW, DIMENSION['get_sub'][sub]>, RANGETYPE>
					}
					: Record<string, never>
		},
		// receive
		Readable<ExtentsDiscreteSet<DOMAINTYPE>>
	>
	{
		const get = 'get' in props ? makeStore(props.get) : undefined;
		const get_sub = 'get_sub' in props
			?  Object.fromEntries(Object.entries(props.get_sub).map(([name, get]) => tuple(name, makeStore(get))))
			: undefined;
		const range = makeStore(props.range);
		const reverse = makeStore(props.reverse);
		const sort = makeStore(props.sort);
		const extents = makeStore(props.extents);
		const domain = makeStore(props.domain);
		const scaleFactory = makeStore(props.scaleFactory);

		const { get_d, get_sub_d } = create_get_sub_d(get, get_sub);

		const checker = derived(
			[get_d, extents],
			([$get_d, $extents], set: ((value: ExtentsDiscreteSet<DOMAINTYPE> | AccumulatorCreator<ROW, META, ExtentsDiscreteSet<DOMAINTYPE>>) => void)) => {

				if (typeof $extents === 'function') {
					return meta.subscribe($meta => {
						const extents = $extents({ meta: $meta });

						if (!extents) {
							set(createAccumulatorCreatorDiscrete($get_d));
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
					set(createAccumulatorCreatorDiscrete($get_d));
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

		const range_d = create_range_d(range, reverse);

		const {
			scale_d,
			get_scaled_d,
			get_sub_scaled_d
		} = create_get_scaled_d(
			scaleFactory,
			meta,
			domain_d,
			range_d,
			get_d,
			get_sub_d
		);

		return {
			discrete: true,
			input: {
				get: get!,
				get_sub: get_sub!,
				range,
				reverse,
				sort,
				extents,
				domain,
				scaleFactory,
			},
			get: get_d,
			get_sub: get_sub_d,
			extents: extents_d,
			domain: domain_d,
			range: range_d,
			scale: scale_d,
			get_scaled: get_scaled_d,
			get_sub_scaled: get_sub_scaled_d as never
		}
	}

	function * createDimensionContinuous<DIMENSION extends DimensionContinuous_Describe<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER>, DOMAINTYPE extends DOMAINSIMPLETYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER extends Scale<DOMAINSIMPLETYPE, RANGETYPE>>(
		props: DIMENSION
	)
		: Generator<
		// yield
		Readable<undefined | ExtentsContinuousBound<DOMAINTYPE> | AccumulatorCreator<ROW, META, undefined | ExtentsContinuousBound<DOMAINTYPE>>>,
		// return
		DimensionContinuous<ROW, META, DOMAINTYPE, RANGETYPE, DOMAINSIMPLETYPE, SCALER> &
		{
			get_scaled: Readable<AccessorFunc<ROW, META, RANGETYPE>>,
			get_sub_scaled:
				'get_sub' extends keyof DIMENSION
					? {
						[sub in keyof DIMENSION['get_sub']]:
						ReplaceLeafType<Infer_DimensionAccessor_ReturnType<ROW, DIMENSION['get_sub'][sub]>, RANGETYPE>
					}
					: Record<string, never>
		},
		// receive
		Readable<undefined | ExtentsContinuousBound<DOMAINTYPE>>
	>
	{
		const get = 'get' in props ? makeStore(props.get) : undefined;
		const get_sub = 'get_sub' in props
			? Object.fromEntries(Object.entries(props.get_sub).map(([name, get]) => tuple(name, makeStore(get))))
			: undefined;
		const range = makeStore(props.range);
		const reverse = makeStore(props.reverse);
		const extents = makeStore(props.extents);
		const extentsDefault = makeStore(props.extentsDefault);
		const domain = makeStore(props.domain);
		const scaleFactory = makeStore(props.scaleFactory);

		const { get_d, get_sub_d } = create_get_sub_d(get, get_sub);

		const checker = derived(
			[get_d, extents, extentsDefault],
			([$get_d, $extents, $extentsDefault], set: ((value: undefined | ExtentsContinuousBound<DOMAINTYPE> | AccumulatorCreator<ROW, META, undefined | ExtentsContinuousBound<DOMAINTYPE>>) => void)) => {

				if (typeof $extents === 'function') {
					return meta.subscribe($meta => {
						const extents = $extents({ meta: $meta });

						if (!extents) {
							set(createAccumulatorCreatorContinuous($get_d, $extentsDefault));
							return;
						}

						set(extents);
						return;
					})
				}

				if (!$extents) {
					set(createAccumulatorCreatorContinuous($get_d, $extentsDefault));
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

		const range_d = create_range_d(range, reverse);

		const {
			scale_d,
			get_scaled_d,
			get_sub_scaled_d
		} = create_get_scaled_d(
			scaleFactory,
			meta,
			domain_d,
			range_d,
			get_d,
			get_sub_d
		);

		return {
			discrete: false,
			input: {
				get: get!,
				get_sub: get_sub!,
				range,
				reverse,
				extents,
				extentsDefault,
				domain,
				scaleFactory,
			},
			get: get_d,
			get_sub: get_sub_d,
			extents: extents_d,
			domain: domain_d,
			range: range_d,
			scale: scale_d,
			get_scaled: get_scaled_d,
			get_sub_scaled: get_sub_scaled_d as never
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
				.filter((accumulator) : accumulator is NonNullable<typeof accumulator> => !!accumulator);

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

	const root = makeElement(
		'chart',
		{
			stores: [area_d],
			returned: ([$area]) => {
				return {
					'style':
						`--chart-w: ${$area.width};` +
						`--chart-h: ${$area.height};` +
						`--chart-ml: ${$area.margin.left};` +
						`--chart-mt: ${$area.margin.top};` +
						`--chart-mr: ${$area.margin.right};` +
						`--chart-mb: ${$area.margin.bottom};` +
						`--chart-mw: ${$area.margin.inner.width};` +
						`--chart-mh: ${$area.margin.inner.height};` +
						`--chart-pl: ${$area.padding.left};` +
						`--chart-pt: ${$area.padding.top};` +
						`--chart-pr: ${$area.padding.right};` +
						`--chart-pb: ${$area.padding.bottom};` +
						`--chart-pw: ${$area.padding.inner.width};` +
						`--chart-ph: ${$area.padding.inner.height};`
				}
			},
			action: (node: HTMLElement): MeltActionReturn<ChartEvents['root']> => {
				const unsub_resize = size
					? resizeObserver(node, () => {
						 size.set({ width: node.clientWidth, height: node.clientHeight });
					})
					: undefined;

				return {
					destroy() {
						unsub_resize?.();
					}
				}
			}
		}
	);

	return {
		data,
		meta,
		width,
		height,
		padding,
		margin,
		area: area_d,
		elements: {
			root
		},
		dimensions: Object.fromEntries(dimensionResults.map(
			(result, i) =>
				tuple(dimensionNames[i], result)
		)) as never,
	};
}
