import { type NumberValue, scaleBand, scaleLinear, scaleSqrt, scaleTime, scaleUtc } from 'd3-scale';
import type { DomainContinuousBound, DomainDiscreteSet, RangeList, Scale } from './types-basic.js';
import type { StringValue } from './types-util.js';

function adjust<FACTORY extends (...args: any) => any>(this: FACTORY, adjust: (scale: ReturnType<FACTORY>) => ReturnType<FACTORY>)
	: FACTORY {
	return <never>Object.assign(
		(...args: never[]) => {
				return adjust(this(...args));
			},
		{ adjust }
		);
}

function applyAdjust<FUNC>(func: FUNC): FUNC & { adjust: typeof adjust } {
	return Object.assign(func as never, { adjust });
}

export function scaleFactoryBand_<DOMAINTYPE extends StringValue = string>(
	{
		domain,
		range
	}: {
		domain: DomainDiscreteSet<DOMAINTYPE>,
		range: RangeList<number> | undefined
	}
) {
	const scale = scaleBand<DOMAINTYPE>()
		.domain(domain);

	if (range)
		scale.range(range);

	return scale as (typeof scale & Scale<DOMAINTYPE, number>);
}

export const scaleFactoryBand = applyAdjust(scaleFactoryBand_);


export function scaleFactoryLinear_<DOMAINTYPE extends NumberValue>(
	{
		domain,
		range
	}: {
		domain: DomainContinuousBound<DOMAINTYPE> | undefined,
		range: RangeList<number> | undefined
	}
) {
	const scale = scaleLinear<number>();

	if (domain)
		scale.domain(domain);

	if (range)
		scale.range(range);

	return scale as (typeof scale & Scale<DOMAINTYPE, number>);
}

export const scaleFactoryLinear = applyAdjust(scaleFactoryLinear_);

export function scaleFactoryTime_<DOMAINTYPE extends Date | NumberValue>(
	{
		domain,
		range
	}: {
		domain: DomainContinuousBound<DOMAINTYPE> | undefined,
		range: RangeList<number> | undefined
	}
) {
	const scale = scaleTime<number>();

	if (domain)
		scale.domain(domain);

	if (range)
		scale.range(range);

	return scale as (typeof scale & Scale<DOMAINTYPE, number>);
}

export const scaleFactoryTime = applyAdjust(scaleFactoryTime_);

export function scaleFactoryUtc_<DOMAINTYPE extends Date | NumberValue>(
	{
		domain,
		range
	}: {
		domain: DomainContinuousBound<DOMAINTYPE> | undefined,
		range: RangeList<number> | undefined
	}
) {
	const scale = scaleUtc<number>();

	if (domain)
		scale.domain(domain);

	if (range)
		scale.range(range);

	return scale as (typeof scale & Scale<DOMAINTYPE, number>);
}

export const scaleFactoryUtc = applyAdjust(scaleFactoryUtc_);

export function scaleFactorySqrt_<DOMAINTYPE extends NumberValue>(
	{
		domain,
		range
	}: {
		domain: DomainContinuousBound<DOMAINTYPE> | undefined,
		range: RangeList<number> | undefined
	}
) {
	const scale = scaleSqrt<number>();

	if (domain)
		scale.domain(domain);

	if (range)
		scale.range(range);

	return scale as (typeof scale & Scale<DOMAINTYPE, number>);
}

export const scaleFactorySqrt = applyAdjust(scaleFactorySqrt_);