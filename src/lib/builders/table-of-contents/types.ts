import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { createTableOfContents } from './create.js';

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
	| 'all-parents'
	| 'lowest-parents'
	| 'highest-parents';

export type HeadingFilterFn = (heading: HTMLHeadingElement) => boolean;

export type ScrollFn = (id: string) => void;

export type CreateTableOfContentsArgs = {
	/**
	 * The ID of the container holding the page content.
	 */
	selector: ReadableProp<string>;
	/**
	 * An array of headings to exclude from the table.
	 */
	exclude?: ReadableProp<Heading[]>;
	/**
	 * The pixel offset added when scrolling to a heading.
	 */
	scrollOffset?: ReadableProp<number>;
	/**
	 * The scroll behavior ('smooth' or 'instant').
	 */
	scrollBehaviour?: ReadableProp<ScrollBehaviour>;
	/**
	 * The type of headings to consider as active:
	 * - 'none': No intersection observers are added, and no headings are considered active.
	 * - 'all': All headings with visible content are considered active.
	 * - 'all-parents': Parents of all headings with visible content are also considered active.
	 * - 'lowest': The heading with the lowest visible content is considered active.
	 * - 'highest': The heading with the highest visible content is considered active.
	 * - 'lowest-parents': Parents of the heading with the lowest visible content are also considered active.
	 * - 'highest-parents': Parents of the heading with the highest visible content are also considered active.
	 */
	activeType?: ReadableProp<ActiveType>;
	/**
	 * A custom filter function for headings.
	 */
	headingFilterFn?: ReadableProp<HeadingFilterFn>;
	/**
	 * A custom scroll function.
	 */
	scrollFn?: ReadableProp<ScrollFn>;
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
	node: HTMLHeadingElement;
	children?: TableOfContentsItem[];
};

export type TableOfContents = ReturnType<typeof createTableOfContents>;
export type TableOfContentsElements = TableOfContents['elements'];
export type TableOfContentsStates = TableOfContents['states'];
