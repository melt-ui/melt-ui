import type { DomainField, ExtentsContinuousBound, ExtentsDiscreteSet } from './types-basic.js';

export interface Accumulator<ROW, META, EXTENTS> {
	accumulate: (row: ROW, info: { meta: META }) => void;
	accumulated: () => EXTENTS;
}

export type AccumulatorCreator<ROW, META, EXTENTS> = () => Accumulator<ROW, META, EXTENTS>;

export function createAccumulatorCreatorDiscrete<ROW, META, DOMAINTYPE>(accessor: ((row: ROW, info: { meta: META }) => DomainField<DOMAINTYPE>)) : AccumulatorCreator<ROW, META, ExtentsDiscreteSet<DOMAINTYPE>> {
	return () => {
		const extents = new Set<DOMAINTYPE>();

		return {
			accumulate(row: ROW, info: { meta: META }) {
				const field = accessor(row, info);

				const check = (field: DomainField<DOMAINTYPE>) => {
					if (Array.isArray(field))
						field.forEach(field => check(field));
					else
					if (field !== null && typeof field === 'object')
						Object.values(field).forEach(field => check(field));
					else
						extents.add(field);
				}

				check(field);
			},
			accumulated() {
				return extents;
			}
		}
	}
}

export function createAccumulatorCreatorContinuous<ROW, META, DOMAINTYPE>(accessor: ((row: ROW, info: { meta: META }) => DomainField<DOMAINTYPE>), extentsDefault: undefined | ExtentsContinuousBound<DOMAINTYPE>) : AccumulatorCreator<ROW, META, undefined | ExtentsContinuousBound<DOMAINTYPE>> {
	return () => {
		let extents: undefined | [DOMAINTYPE, DOMAINTYPE] = undefined;

		return {
			accumulate(row: ROW, info: { meta: META }) {
				const field = accessor(row, info);

				const check = (field: DomainField<DOMAINTYPE>) => {
					if (Array.isArray(field))
						field.forEach(field => check(field));
					else
					if (field !== null && typeof field === 'object')
						Object.values(field).forEach(field => check(field));
					else
					if (extents === undefined)
						extents = [field, field]
					else
					if (field < extents[0])
						extents[0] = field
					else
					if (field > extents[1])
						extents[1] = field;
				}

				check(field);
			},
			accumulated() {
				return extents ?? extentsDefault;
			}
		}
	}
}