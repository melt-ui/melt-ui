import type { createTableOfContents } from './create';

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type ScrollBehaviour = 'smooth' | 'instant';

/**
 * This type describes which headings should be considered active.
 */
export type ActiveType =
	| 'none'
	| 'lowest'
	| 'highest'
	| 'all'
	| 'lowest-parents'
	| 'highest-parents';

export type HeadingFilterFn = (heading: HTMLHeadingElement) => boolean;

export type ScrollFn = (id: string) => void;

/**
 * Arguments to be passed to the Table of Contents builder.
 *
 * @typeParam selector - The id of the container in which the content of the page is.
 * @param exclude - A list of headings that should be excluded in the table.
 * @param scrollOffset - The pixel offset that should be added when scrolling to a heading.
 * @param scrollBehaviour - Describes whether the scroll behaviour should be smooth or not.
 * @param activeType - Describes which headings should be considered active.
 */
export type CreateTableOfContentsArgs = {
	selector: string;
	exclude?: Heading[];
	scrollOffset?: number;
	scrollBehaviour?: ScrollBehaviour;
	activeType?: ActiveType;
	headingFilterFn?: HeadingFilterFn;
	scrollFn?: ScrollFn;
};

export type ElementHeadingLU = {
	[key: number]: number;
};

export type HeadingParentsLU = {
	[key: number]: number[] | null;
};

export type TableOfContentsItem = {
	title: string;
	index: number;
	id: string;
	children?: TableOfContentsItem[];
};

export type CreateTableOfContentsReturn = ReturnType<typeof createTableOfContents>;
