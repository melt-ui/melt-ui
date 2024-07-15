import { type NumberValue, scaleBand, scaleLinear, scaleSqrt } from 'd3-scale';
import type { DomainContinuousBound, DomainDiscreteSet, RangeList, Scaler } from './types-basic.js';
import type { StringValue } from './types-util.js';

export function scalerFactoryBand<DOMAINTYPE extends StringValue = string>(
	{
		domain_d,
		range_d
	}: {
		domain_d: DomainDiscreteSet<DOMAINTYPE>,
		range_d: RangeList<number> | undefined
	}
) {
	const scale = scaleBand<DOMAINTYPE>()
		.domain(domain_d);

	if (range_d)
		scale.range(range_d);

	return scale as (typeof scale & Scaler<DOMAINTYPE, number>);
}

export function scalerFactoryLinear<DOMAINTYPE extends NumberValue>(
	{
		domain_d,
		range_d
	}: {
		domain_d: DomainContinuousBound<DOMAINTYPE> | undefined,
		range_d: RangeList<number> | undefined
	}
) {
	const scale = scaleLinear<number>();

	if (domain_d)
		scale.domain(domain_d);

	if (range_d)
		scale.range(range_d);

	return scale as (typeof scale & Scaler<DOMAINTYPE, number>);
}

export function scalerFactorySqrt<DOMAINTYPE extends NumberValue>(
	{
		domain_d,
		range_d
	}: {
		domain_d: DomainContinuousBound<DOMAINTYPE> | undefined,
		range_d: RangeList<number> | undefined
	}
) {
	const scale = scaleSqrt<number>();

	if (domain_d)
		scale.domain(domain_d);

	if (range_d)
		scale.range(range_d);

	return scale as (typeof scale & Scaler<DOMAINTYPE, number>);
}