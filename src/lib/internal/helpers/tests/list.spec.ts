import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { getFirstOption, getOptions } from '../list';
import List from './ListTest.svelte';

describe('getFirstOption', () => {
	it('returns the first option', () => {
		const { getByRole, getByText } = render(List);
		const [list, firstOption] = [getByRole('list'), getByText('Caramel')];
		// Assert that the first option is returned.
		expect(getFirstOption(list)).toBe(firstOption);
	});
	it('returns null if there are no options', () => {
		const { getByRole } = render(List);
		// The menu is empty.
		const list = getByRole('menu');
		// Assert that null is returned since there are no options.
		expect(getFirstOption(list)).toBeNull();
	});
});

describe('getOptions', () => {
	it('returns all options', () => {
		const { getByRole, getAllByRole } = render(List);
		const [list, options] = [getByRole('list'), getAllByRole('option')];
		// Assert that all options are returned.
		expect(getOptions(list)).toStrictEqual(options);
	});
	it('returns an empty array if there are no options', () => {
		const { getByRole } = render(List);
		// The menu is empty.
		const list = getByRole('menu');
		// Assert that an empty array is returned since there are no options.
		expect(getOptions(list)).toStrictEqual([]);
	});
});
