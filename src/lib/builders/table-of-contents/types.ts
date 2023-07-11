
export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type CreateTableOfContentsArgs = {
    /** A list of headings that should be excluded in the table. */
    exclude?: Heading[];
};

export type ElementHeadingLU = {
    [key: number]: number;
}

export type HeadingParentsLU = {
    [key: number]: number[] | null;
}