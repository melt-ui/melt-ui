export type Page = {
	type: 'page';
	value: number;
};

export type Ellipsis = {
	type: 'ellipsis';
};

export type PageItem = (Page | Ellipsis) & {
	/** Unique key for the item, to be passed to svelte #each block */
	key: string;
};

export type GetPageItemsArgs = {
	totalPages: number;
	siblingCount?: number;
	page?: number;
};

export function getPageItems({
	page = 1,
	totalPages,
	siblingCount = 1,
}: GetPageItemsArgs): Array<PageItem> {
	const pageItems: Array<PageItem> = [];
	const pagesToShow = new Set([1, totalPages]);
	const firstItemWithSiblings = 3 + siblingCount;
	const lastItemWithSiblings = totalPages - 2 - siblingCount;

	if (firstItemWithSiblings > lastItemWithSiblings) {
		for (let p = 2; p <= totalPages - 1; p++) {
			pagesToShow.add(p);
		}
	} else if (page < firstItemWithSiblings) {
		for (let p = 2; p <= Math.min(firstItemWithSiblings, totalPages); p++) {
			pagesToShow.add(p);
		}
	} else if (page > lastItemWithSiblings) {
		for (let p = totalPages - 1; p >= Math.max(lastItemWithSiblings, 2); p--) {
			pagesToShow.add(p);
		}
	} else {
		for (
			let p = Math.max(page - siblingCount, 2);
			p <= Math.min(page + siblingCount, totalPages);
			p++
		) {
			pagesToShow.add(p);
		}
	}

	const addPage = (value: number) => {
		pageItems.push({ type: 'page', value, key: `page-${value}` });
	};
	const addEllipsis = () => {
		pageItems.push({ type: 'ellipsis', key: `ellipsis-${pageItems.length}` });
	};

	let lastNumber = 0;
	for (const page of Array.from(pagesToShow).sort((a, b) => a - b)) {
		if (page - lastNumber > 1) {
			addEllipsis();
		}
		addPage(page);
		lastNumber = page;
	}

	return pageItems;
}
