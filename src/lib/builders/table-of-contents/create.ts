import { createElHelpers } from "@melt-ui/svelte/internal/helpers";
import type { Defaults } from "$lib/internal/types";

import { derived, writable, type Writable } from "svelte/store";

import type { Heading, CreateTableOfContentsArgs, ElementHeadingLU, HeadingParentsLU, TOCType, ToC } from "./types";

const defaults = {
    exclude: ['h1'],
} satisfies Defaults<CreateTableOfContentsArgs>;

const { name } = createElHelpers('table-of-contents');

export function scroll_to_element(headingElem: HTMLElement): void {
    const elemTarget: Element | null = document.querySelector(`#${headingElem.id}`);
    elemTarget?.scrollIntoView({ behavior: 'smooth' });
}

 /**
  * @param { CreateTableOfContentsArgs } args Provide the arguments for the table of contents builder.
  * @returns { ToC }
 */
export function createTableOfContents(args: CreateTableOfContentsArgs = {}) {

    const argsWithDefaults = { ...defaults, ...args };

    // Variables
    const possibleHeadings: Heading[] = ['h2', 'h3', 'h4', 'h5', 'h6'];
    let headingsList: Element[] = [];
    let elementsList: Element[] = [];
    /** Lookup to see which heading an element belongs to. */
    let elementHeadingLU: ElementHeadingLU = {};
    /** Lookup to see which parent headings a heading has. */
    let headingParentsLU: HeadingParentsLU = {};
    /** List of the active parent indexes. */
    let active_parents_idxs: number[] = [];
    /** List of the indexes of the visible elements. */
    let visible_el_idxs: number[] = [];
    
    let observer: IntersectionObserver | null = null;
    const observer_threshold = 0.25;

    // Stores
    // let active_heading: Writable<number> = writable(0);
    let headings: Writable<HTMLElement[]> = writable([]);
    let activeHeadingIdxs: Writable<number[]> = writable([]);

    const { subscribe } = derived([headings, activeHeadingIdxs], ($state) => ({ headings: $state[0].map((h, i) => ({ heading: h, active: $state[1].includes(i), ...headingIndentationStyles[<Heading>h.tagName.toLowerCase()] })) }));

    function generate_initial_lists(): void {
        const allowed_headings = possibleHeadings.filter((h) => !excludeHeadings.includes(h));

        const el_target = document.querySelector(target);
        // const el_target = node;
        const target_headers: NodeListOf<Element> | undefined = el_target?.querySelectorAll(allowed_headings.join(', '));

        // Create a unique ID for each heading which doesn't have one.
        target_headers?.forEach((el: Element, i: number) => {
            if (!el.id) {
                const unique_id = Math.random().toString(16).slice(2);
                el.id = `heading-${i}-${unique_id}`;
            }

            headingsList.push(el);
        });

        headingsList = [...headingsList];

        // Get all elements in our el_target and convert it from an HTMLCollection to an array.
        elementsList = [].slice.call(el_target?.getElementsByTagName('*'));

        // Filter the array, so that only the allowed headings and elements with no children are in the list to avoid problems with elements that wrap around others.
        elementsList = elementsList.filter((el) => (<string[]>allowed_headings).includes(el.nodeName.toLowerCase()) || el.children.length === 0);

        // We don't care about elements before our first header element, so we can remove those as well.
        elementsList.splice(0, elementsList.indexOf(headingsList[0]));

        headings.set(<HTMLElement[]>headingsList);
    }

    function find_parent_idxs(): void {
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

    function create_element_heading_lu() {
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

    function handle_el_interaction(entries: IntersectionObserverEntry[]) {
        // Iterate through all elements that crossed the observer_threshold.
        for (let i = 0; i < entries.length; i++) {
            // Get the index of the observed element in our elementsList, as well as the ToC heading it belongs to.
            const el_idx = elementsList.indexOf(<HTMLElement>entries[i].target);
            const toc_idx = elementHeadingLU[el_idx];

            if (entries[i].intersectionRatio >= observer_threshold) {
                // Only add the observed element to the visible_el_idxs list if it isn't added yet.
                if (visible_el_idxs.indexOf(el_idx) === -1) {
                    visible_el_idxs = [...visible_el_idxs, el_idx];

                    // Only add active parents if parent headings should be highlighted.
                    active_parents_idxs =
                        (tocType === 'highest-parents' || tocType === 'lowest-parents') && headingParentsLU[toc_idx]
                            ? [...active_parents_idxs, ...(<number[]>headingParentsLU[toc_idx])]
                            : [];
                }
            } else {
                // Remove the observed element from the visible_el_idxs list if the intersection ratio is below the threshold.
                visible_el_idxs = visible_el_idxs.filter((item) => item !== el_idx);

                // Remove all parents of obsIndex from the active_parents_idxs list.
                if ((tocType === 'highest-parents' || tocType === 'lowest-parents') && headingParentsLU[toc_idx]) {
                    headingParentsLU[toc_idx]?.forEach((parent: number) => {
                        const index = active_parents_idxs.indexOf(parent);
                        active_parents_idxs.splice(index, 1);
                    });
                }
            }
        }

        const all_active_h_idxs = Array.from(new Set(visible_el_idxs.map((idx) => elementHeadingLU[idx])));

        let active_h_idxs: number[] = [];

        if (tocType === 'highest') {
            active_h_idxs = [Math.min(...all_active_h_idxs)];
        } else if (tocType === 'lowest') {
            active_h_idxs = [Math.max(...all_active_h_idxs)];
        } else if (tocType === 'all-active') {
            active_h_idxs = all_active_h_idxs;
        } else if (tocType === 'highest-parents') {
            const active_h_idx = Math.min(...all_active_h_idxs);

            if (headingParentsLU[active_h_idx]) {
                active_h_idxs = [...<[]>headingParentsLU[active_h_idx], active_h_idx];
            } else {
                active_h_idxs = [active_h_idx];
            }
        } else if (tocType === 'lowest-parents') {
            const active_h_idx = Math.max(...all_active_h_idxs);

            if (headingParentsLU[active_h_idx]) {
                active_h_idxs = [...<[]>headingParentsLU[active_h_idx], active_h_idx];
            } else {
                active_h_idxs = [active_h_idx];
            }
        }

        // Set store to active indexes.
        activeHeadingIdxs.set(active_h_idxs);
    }

    function init() {
        generate_initial_lists();
        find_parent_idxs();
        create_element_heading_lu();

        // Create observer and observe all elements.
        observer = new IntersectionObserver(handle_el_interaction, { root: null, threshold: observer_threshold });
        elementsList.forEach((el) => observer?.observe(el));
    }

    init();

    function destroy(): void {
        observer?.disconnect();
    }

    return {
        subscribe,
        destroy
    }
}
