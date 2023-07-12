import { describe, expect, it } from 'vitest';
import { omit } from '../object';

describe('omit', () => {
	it('omits keys from a given object', () => {
		expect(
			omit({ sweet: ['Caramel', 'Chocolate'], savory: ['Basil', 'Bacon'] }, 'sweet')
		).toStrictEqual({ savory: ['Basil', 'Bacon'] });
	});
});
