
export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * The ToC type describes which headings should be considered active.
 */
export type TOCType = 'lowest' | 'highest' | 'all-active' | 'lowest-parents' | 'highest-parents';

/**
 * Arguments to be passed to the Table of Contents builder.
 * 
 * @typeParam exclude - A list of headings that should be excluded in the table.
 * @typeParam scrollOffset - The pixel offset that should be added when scrolling to a heading.
 * @typeParam scrollBehaviour - Describes whether the scroll behaviour should be smooth or not.
 * @typeParam tocType - Describes which headings should be considered active.
 */
export type CreateTableOfContentsArgs = {
    selector: string,
    exclude?: Heading[];
    scrollOffset?: number;
    scrollBehaviour?: 'smooth' | 'jump';
    tocType?: TOCType;
};

export type ElementHeadingLU = {
    [key: number]: number;
}

export type HeadingParentsLU = {
    [key: number]: number[] | null;
}