// import { builder, createElHelpers, generateId, isBrowser } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";

import { onMount } from "svelte";
import { get, writable, type Writable } from "svelte/store";

import type { Heading, CreateTableOfContentsArgs, ElementHeadingLU, HeadingParentsLU, TableOfContentsItem } from "./types";

const defaults = {
    exclude: ['h1'],
    scrollOffset: 0,
    scrollBehaviour: 'smooth',
    tocType: 'lowest',
} satisfies Defaults<CreateTableOfContentsArgs>;

// Do we need this?
// const { name } = createElHelpers('table-of-contents');

// https://www.w3.org/TR/WCAG20-TECHS/G64.html
// https://stackoverflow.com/questions/49820013/javascript-scrollintoview-smooth-scroll-and-offset?answertab=scoredesc#tab-top

/** TODO: add scroll to element into an action for the individual nav items. */
export function scrollToElement(headingElem: HTMLElement): void {
    const elemTarget: Element | null = document.querySelector(`#${headingElem.id}`);
    elemTarget?.scrollIntoView({ behavior: 'smooth' });
}

 /**
  * @param args Provide the arguments for the table of contents builder.
 */
export function createTableOfContents(args: CreateTableOfContentsArgs) {
    const argsWithDefaults = { ...defaults, ...args };
    const { selector, exclude, tocType } = argsWithDefaults;

    // Variables
    const possibleHeadings: Heading[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    let headingsList: Element[] = [];
    let elementsList: Element[] = [];
    /** Lookup to see which heading an element belongs to. */
    const elementHeadingLU: ElementHeadingLU = {};
    /** Lookup to see which parent headings a heading has. */
    const headingParentsLU: HeadingParentsLU = {};
    /** List of the active parent indexes. */
    const activeParentIdxs: Writable<number[]> = writable([]);
    /** List of the indexes of the visible elements. */
    const visibleElementIdxs: Writable<number[]> = writable([]);
    
    let observer: IntersectionObserver | null = null;
    const observer_threshold = 0.25;

    // Stores
    // const headings: Writable<HTMLElement[]> = writable([]);
    const activeHeadingIdxs: Writable<number[]> = writable([]);
    const headingsTree: Writable<TableOfContentsItem[]> = writable([]);

    /**
     * Create a tree view of our headings so that the hierarchy is represented.
     * @param arr An array of heading elements.
     * @param startIndex The parent elements original index in the array.
     * @returns 
     */
    function createTree(arr: Element[], startIndex = 0): TableOfContentsItem[] {
        const tree: TableOfContentsItem[] = [];
        let i = 0;
        while (i < arr.length) {
            const node: TableOfContentsItem = { title: arr[i].innerHTML, index: startIndex + i, id: arr[i].id, items: [] };
            let j = i + 1;
            while (j < arr.length && parseInt(arr[j].tagName.charAt(1)) > parseInt(arr[i].tagName.charAt(1))) {
                j++;
            }
            node.items = createTree(arr.slice(i + 1, j), startIndex + i + 1);
            tree.push(node);
            i = j;
        }
        return tree;
    }

    function generateInitialLists(): void {
        const includedHeadings = possibleHeadings.filter((h) => !exclude.includes(h));

        const elementTarget = document.querySelector(selector);
        const targetHeaders: NodeListOf<HTMLHeadingElement> | undefined = elementTarget?.querySelectorAll(includedHeadings.join(', '));

        // Create a unique ID for each heading which doesn't have one.
        targetHeaders?.forEach((el: HTMLHeadingElement, i: number) => {
            if (!el.id) {
                // const uniqueID = generateId();
                const uniqueID = el.innerText
                    .replaceAll(/[^a-zA-Z0-9 ]/g, '')
                    .replaceAll(' ', '-')
                    .toLowerCase();
                el.id = `heading-${i}-${uniqueID}`;
            }

            headingsList.push(el);
        });

        headingsList = [...headingsList];

        // Get all elements in our elementTarget and convert it from an HTMLCollection to an array.
        elementsList = [].slice.call(elementTarget?.getElementsByTagName('*'));

        // Filter the array, so that only the allowed headings and elements with no children are in the list to avoid problems with elements that wrap around others.
        elementsList = elementsList.filter((el) => (<string[]>includedHeadings).includes(el.nodeName.toLowerCase()) || el.children.length === 0);

        // We don't care about elements before our first header element, so we can remove those as well.
        elementsList.splice(0, elementsList.indexOf(headingsList[0]));
    }

    function findParentIdxs(): void {
        /** Get all parents for each heading element, by checking
         *  which previous headings in the list have a lower H value,
         *  so H1 < H2 < H3 < ...
         */
        headingsList.forEach((h, i) => {
            headingParentsLU[i] = null;

            let current_heading: string = h.tagName;
            let parents: number[] = [];

            for (let j = i - 1; j >= 0; j--) {
                if (headingsList[j].tagName < current_heading) {
                    current_heading = headingsList[j].tagName;
                    parents = [...parents, j];
                }
            }

            headingParentsLU[i] = parents.length > 0 ? parents : null;
        });
    }

    function createElementHeadingLU() {
        headingsList.forEach((h: Element, i: number) => {
            // Find all elements between the current heading and the next one and assign them the current heading.
            const startIndex = elementsList.indexOf(headingsList[i]);
            const endIndex =
                i !== headingsList.length - 1
                    ? elementsList.indexOf(headingsList[i + 1])
                    : elementsList.length;

            for (let j = startIndex; j < endIndex; j++) {
                elementHeadingLU[j] = i;
            }
        });
    }

    function handleElementObservation(entries: IntersectionObserverEntry[]) {
        // Iterate through all elements that crossed the observer_threshold.
        for (let i = 0; i < entries.length; i++) {
            // Get the index of the observed element in our elementsList, as well as the ToC heading it belongs to.
            const el_idx = elementsList.indexOf(<HTMLElement>entries[i].target);
            const toc_idx = elementHeadingLU[el_idx];

            let tempVisibleElementIdxs = get(visibleElementIdxs);

            if (entries[i].intersectionRatio >= observer_threshold) {
                // Only add the observed element to the visibleElementIdxs list if it isn't added yet.

                if (tempVisibleElementIdxs.indexOf(el_idx) === -1) {
                    tempVisibleElementIdxs = [...tempVisibleElementIdxs, el_idx];
                    visibleElementIdxs.set(tempVisibleElementIdxs);

                    // Only add active parents if parent headings should be highlighted.
                    activeParentIdxs.set((tocType === 'highest-parents' || tocType === 'lowest-parents') && headingParentsLU[toc_idx]
                            ? [...get(activeParentIdxs), ...(<number[]>headingParentsLU[toc_idx])]
                            : []);
                }
            } else {
                // Remove the observed element from the visibleElementIdxs list if the intersection ratio is below the threshold.
                tempVisibleElementIdxs = tempVisibleElementIdxs.filter((item) => item !== el_idx);
                visibleElementIdxs.set(tempVisibleElementIdxs);

                // Remove all parents of obsIndex from the activeParentIdxs list.
                if ((tocType === 'highest-parents' || tocType === 'lowest-parents') && headingParentsLU[toc_idx]) {
                    headingParentsLU[toc_idx]?.forEach((parent: number) => {
                        const tempActiveParentIdxs = get(activeParentIdxs);
                        const index = tempActiveParentIdxs.indexOf(parent);
                        tempActiveParentIdxs.splice(index, 1);
                        activeParentIdxs.set(tempActiveParentIdxs);
                    });
                }
            }
        }

        const allActiveHeaderIdxs = Array.from(new Set(get(visibleElementIdxs).map((idx) => elementHeadingLU[idx])));

        let activeHeaderIdxs: number[];

        if (allActiveHeaderIdxs.length === 0) {
            activeHeaderIdxs = [];
        } else if (tocType === 'highest') {
            activeHeaderIdxs = [Math.min(...allActiveHeaderIdxs)];
        } else if (tocType === 'lowest') {
            activeHeaderIdxs = [Math.max(...allActiveHeaderIdxs)];
        } else if (tocType === 'all-active') {
            activeHeaderIdxs = allActiveHeaderIdxs;
        } else {
            const activeHeaderIdx = tocType === 'highest-parents' ? Math.min(...allActiveHeaderIdxs) : Math.max(...allActiveHeaderIdxs);

            if (headingParentsLU[activeHeaderIdx]) {
                activeHeaderIdxs = [...<[]>headingParentsLU[activeHeaderIdx], activeHeaderIdx];
            } else {
                activeHeaderIdxs = [activeHeaderIdx];
            }
        }

        // Set store to active indexes.
        activeHeadingIdxs.set(activeHeaderIdxs);
    }

    onMount(() => {
        // Init
        generateInitialLists();
        findParentIdxs();
        createElementHeadingLU();

        headingsTree.set(createTree(headingsList));

        // Create observer and observe all elements.
        observer = new IntersectionObserver(handleElementObservation, { root: null, threshold: observer_threshold });
        elementsList.forEach((el) => observer?.observe(el));

        return () => {
            observer?.disconnect();
        };
    });

    return {
        activeHeadingIdxs,
        headingsTree
    }
}
