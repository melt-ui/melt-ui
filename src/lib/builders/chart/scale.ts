import { type NumberValue, scaleBand, scaleLinear, scaleSqrt, scaleTime, scaleUtc } from 'd3-scale';
import type { DomainContinuousBound, DomainDiscreteSet, RangeList, Scale } from './types-basic.js';
import type { StringValue } from './types-util.js';

export function scaleFactoryAdjust<FACTORY extends (...args: any) => any>(factory: FACTORY, adjust: (scale: ReturnType<FACTORY>) => ReturnType<FACTORY>)
	: FACTORY {
	return <never>((...args: never[]) => {
		return adjust(factory(...args));
	});
}

export function scaleFactoryBand<DOMAINTYPE extends StringValue = string>(
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

export function scaleFactoryLinear<DOMAINTYPE extends NumberValue>(
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

export function scaleFactoryTime<DOMAINTYPE extends Date | NumberValue>(
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

export function scaleFactoryUtc<DOMAINTYPE extends Date | NumberValue>(
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

export function scaleFactorySqrt<DOMAINTYPE extends NumberValue>(
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