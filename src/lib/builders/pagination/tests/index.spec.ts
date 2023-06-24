import { describe, it, expect } from 'vitest';
import { getPageItems, type GetPageItemsArgs, type PageItem } from '../helpers';

const testCases: Array<[GetPageItemsArgs, string]> = [
	[{ totalPages: 100 }, '1,2,3,4,...,100'],
	[{ totalPages: 100, page: 3 }, '1,2,3,4,...,100'],
	[{ totalPages: 100, page: 4 }, '1,...,3,4,5,...,100'],
	[{ totalPages: 100, page: 5 }, '1,...,4,5,6,...,100'],
	[{ totalPages: 100, page: 97 }, '1,...,96,97,98,...,100'],
	[{ totalPages: 100, page: 98 }, '1,...,97,98,99,100'],
	[{ totalPages: 5, page: 3 }, '1,2,3,4,5'],
	[{ totalPages: 6, page: 4 }, '1,2,3,4,5,6'],
	[{ totalPages: 7, page: 4 }, '1,...,3,4,5,...,7'],
	[{ totalPages: 3, page: 2 }, '1,2,3'],
	[{ totalPages: 4, page: 2 }, '1,2,3,4'],
	[{ totalPages: 100, siblingCount: 2 }, '1,2,3,4,5,...,100'],
	[{ totalPages: 100, siblingCount: 3 }, '1,2,3,4,5,6,...,100'],
	[{ totalPages: 100, siblingCount: 3, page: 5 }, '1,2,3,4,5,6,...,100'],
	[{ totalPages: 100, siblingCount: 3, page: 6 }, '1,...,3,4,5,6,7,8,9,...,100'],
	[{ totalPages: 100, siblingCount: 3, page: 97 }, '1,...,95,96,97,98,99,100'],
	[{ totalPages: 100, siblingCount: 3, page: 96 }, '1,...,95,96,97,98,99,100'],
	[{ totalPages: 100, siblingCount: 3, page: 95 }, '1,...,92,93,94,95,96,97,98,...,100'],
	[{ totalPages: 7, page: 4, siblingCount: 2 }, '1,2,3,4,5,6,7'],
	[{ totalPages: 8, page: 5, siblingCount: 2 }, '1,2,3,4,5,6,7,8'],
	[{ totalPages: 9, page: 1, siblingCount: 2 }, '1,2,3,4,5,...,9'],
	[{ totalPages: 9, page: 5, siblingCount: 2 }, '1,...,3,4,5,6,7,...,9'],
	[{ totalPages: 9, page: 6, siblingCount: 2 }, '1,...,5,6,7,8,9'],
];

function pageItemsToString(pageItems: Array<PageItem>): string {
	let result = '';

	pageItems.forEach((item, index) => {
		if (item.type === 'page') {
			result += item.value;
		} else if (item.type === 'ellipsis') {
			result += '...';
		}

		if (index < pageItems.length - 1) {
			result += ',';
		}
	});

	return result;
}

describe('getPageItems', () => {
	testCases.forEach(([args, expected]) => {
		it(`should return ${expected} for ${JSON.stringify(args)}`, () => {
			const pageItems = getPageItems(args);
			const result = pageItemsToString(pageItems);
			expect(result).toBe(expected);
		});
	});
});
