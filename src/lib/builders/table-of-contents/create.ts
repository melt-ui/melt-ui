import {
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';

import { dequal } from 'dequal';
import { derived, writable } from 'svelte/store';

import { safeOnMount } from '$lib/internal/helpers/lifecycle';
import { withGet } from '$lib/internal/helpers/withGet';
import type {
	CreateTableOfContentsArgs,
	ElementHeadingLU,
	Heading,
	HeadingParentsLU,
	TableOfContentsItem,
} from './types';

const defaults = {
	exclude: ['h1'],
	scrollOffset: 0,
	scrollBehaviour: 'smooth',
	activeType: 'lowest',
} satisfies Defaults<CreateTableOfContentsArgs>;

export function createTableOfContents(args: CreateTableOfContentsArgs) {
	const argsWithDefaults = { ...defaults, ...args };
	const {
		selector,
		exclude,
		activeType,
		scrollBehaviour,
		scrollOffset,
		headingFilterFn,
		scrollFn,
	} = argsWithDefaults;

	const { name } = createElHelpers('table-of-contents');

	// Variables
	const possibleHeadings: Heading[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	let headingsList: HTMLHeadingElement[] = [];
	let elementsList: Element[] = [];
	/** Lookup to see which heading an element belongs to. */
	let elementHeadingLU: ElementHeadingLU = {};
	/** Lookup to see which parent headings a heading has. */
	let headingParentsLU: HeadingParentsLU = {};
	/** List of the active parent indexes. */
	const activeParentIdxs = withGet(writable<number[]>([]));
	/** List of the indexes of the visible elements. */
	const visibleElementIdxs = withGet(writable<number[]>([]));

	let elementTarget: Element | null = null;

	let mutationObserver: MutationObserver | null = null;

	let observer: IntersectionObserver | null = null;
	const observer_threshold = 0.01;

	// Stores
	const activeHeadingIdxs = withGet(writable<number[]>([]));
	const headingsTree = withGet(writable<TableOfContentsItem[]>([]));

	// Helpers
	function generateInitialLists(elementTarget: Element) {
		let headingsList: HTMLHeadingElement[] = [];
		let elementsList: Element[] = [];

		const includedHeadings = possibleHeadings.filter((h) => !exclude.includes(h));

		const targetHeaders: NodeListOf<HTMLHeadingElement> | undefined =
			elementTarget?.querySelectorAll(includedHeadings.join(', '));

		// Create a unique ID for each heading which doesn't have one.
		targetHeaders?.forEach((el: HTMLHeadingElement) => {
			if (!el.id) {
				const uniqueID = el.innerText
					.replaceAll(/[^a-zA-Z0-9 ]/g, '')
					.replaceAll(' ', '-')
					.toLowerCase();
				el.id = `${uniqueID}`;
			}

			headingsList.push(el);
		});

		headingsList = [...headingsList];

		if (headingFilterFn) {
			headingsList = headingsList.filter((heading) => headingFilterFn(heading));
		}

		// Get all elements in our elementTarget and convert it from an HTMLCollection to an array.
		elementsList = [].slice.call(elementTarget?.getElementsByTagName('*'));

		// Filter the array, so that only the allowed headings and elements with no children are in the list to avoid problems with elements that wrap around others.
		elementsList = elementsList.filter(
			(el) =>
				(<string[]>includedHeadings).includes(el.nodeName.toLowerCase()) || el.children.length === 0
		);

		// We don't care about elements before our first header element, so we can remove those as well.
		elementsList.splice(0, elementsList.indexOf(headingsList[0]));

		return {
			headingsList,
			elementsList,
		};
	}

	/**
	 * Create a tree view of our headings so that the hierarchy is represented.
	 * @param arr An array of heading elements.
	 * @param startIndex The parent elements original index in the array.
	 */
	function createTree(arr: HTMLHeadingElement[], startIndex = 0): TableOfContentsItem[] {
		const tree: TableOfContentsItem[] = [];

		let i = 0;
		while (i < arr.length) {
			const node: TableOfContentsItem = {
				title: arr[i].innerText,
				index: startIndex + i,
				id: arr[i].id,
				node: arr[i],
				children: [],
			};

			let j = i + 1;

			while (
				j < arr.length &&
				parseInt(arr[j].tagName.charAt(1)) > parseInt(arr[i].tagName.charAt(1))
			) {
				j++;
			}

			// Recursive call.
			node.children = createTree(arr.slice(i + 1, j), startIndex + i + 1);
			tree.push(node);
			i = j;
		}

		return tree;
	}

	/**
	 * Scrolls to the element specified by the selector.
	 * The offset and scroll behaviour are determined by the
	 * builder arguments.
	 *
	 * Source: https://stackoverflow.com/questions/49820013/javascript-scrollintoview-smooth-scroll-and-offset?answertab=scoredesc#tab-top
	 *
	 * @param selector The id of the element.
	 */
	function scrollToTargetAdjusted(selector: string): void {
		const element = document.getElementById(selector);

		if (element) {
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - scrollOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: scrollBehaviour,
			});
		}
	}

	const shouldHighlightParents =
		activeType === 'highest-parents' ||
		activeType === 'lowest-parents' ||
		activeType === 'all-parents';

	function handleElementObservation(entries: IntersectionObserverEntry[]) {
		// Iterate through all elements that crossed the observer_threshold.
		for (let i = 0; i < entries.length; i++) {
			// Get the index of the observed element in our elementsList, as well as the ToC heading it belongs to.
			const el_idx = elementsList.indexOf(<HTMLElement>entries[i].target);
			const toc_idx = elementHeadingLU[el_idx];

			let tempVisibleElementIdxs = visibleElementIdxs.get();

			if (entries[i].intersectionRatio >= observer_threshold) {
				// Only add the observed element to the visibleElementIdxs list if it isn't added yet.
				if (tempVisibleElementIdxs.indexOf(el_idx) === -1) {
					tempVisibleElementIdxs = [...tempVisibleElementIdxs, el_idx];
					visibleElementIdxs.set(tempVisibleElementIdxs);

					// Only add active parents if parent headings should be highlighted.
					if (shouldHighlightParents && headingParentsLU[toc_idx]) {
						activeParentIdxs.update((prev) => {
							return [...prev, ...(<number[]>headingParentsLU[toc_idx])];
						});
					}
				}
			} else {
				// Remove the observed element from the visibleElementIdxs list if the intersection ratio is below the threshold.
				tempVisibleElementIdxs = tempVisibleElementIdxs.filter((item) => item !== el_idx);
				visibleElementIdxs.set(tempVisibleElementIdxs);

				// Remove all parents of obsIndex from the activeParentIdxs list.
				if (shouldHighlightParents && headingParentsLU[toc_idx]) {
					activeParentIdxs.update((prev) => {
						const newArr = [...prev];
						headingParentsLU[toc_idx]?.forEach((parent: number) => {
							const index = newArr.indexOf(parent);
							newArr.splice(index, 1);
						});

						return newArr;
					});
				}
			}
		}

		const allActiveHeaderIdxs = Array.from(
			new Set(visibleElementIdxs.get().map((idx) => elementHeadingLU[idx]))
		);

		let activeHeaderIdxs: number[];

		if (allActiveHeaderIdxs.length === 0) {
			activeHeaderIdxs = [];
		} else {
			switch (activeType) {
				case 'highest':
					activeHeaderIdxs = [Math.min(...allActiveHeaderIdxs)];
					break;
				case 'lowest':
					activeHeaderIdxs = [Math.max(...allActiveHeaderIdxs)];
					break;
				case 'all':
					activeHeaderIdxs = allActiveHeaderIdxs;
					break;
				case 'all-parents': {
					const parentIdxs = allActiveHeaderIdxs.flatMap((idx) => headingParentsLU[idx] ?? []);
					activeHeaderIdxs = [...allActiveHeaderIdxs, ...parentIdxs];
					break;
				}
				default: {
					const activeHeaderIdx =
						activeType === 'highest-parents'
							? Math.min(...allActiveHeaderIdxs)
							: Math.max(...allActiveHeaderIdxs);

					if (headingParentsLU[activeHeaderIdx]) {
						activeHeaderIdxs = [...(<[]>headingParentsLU[activeHeaderIdx]), activeHeaderIdx];
					} else {
						activeHeaderIdxs = [activeHeaderIdx];
					}
				}
			}
		}

		// Set store to active indexes.
		activeHeadingIdxs.set(activeHeaderIdxs);
	}

	function initialization() {
		observer?.disconnect();

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

		headingsTree.set(createTree(headingsList));

		if (activeType !== 'none') {
			// Create observer and observe all elements.
			observer = new IntersectionObserver(handleElementObservation, {
				root: null,
				threshold: observer_threshold,
			});
			elementsList.forEach((el) => observer?.observe(el));
		}
	}

	function mutationHandler() {
		const newElementTarget = document.querySelector(selector);

		if (!newElementTarget) return;

		const { headingsList: newHeadingsList, elementsList: newElementsList } =
			generateInitialLists(newElementTarget);

		if (dequal(headingsList, newHeadingsList)) return;

		// Update lists and LUs and re-run initialization.
		headingsList = newHeadingsList;
		elementsList = newElementsList;

		headingParentsLU = {};
		elementHeadingLU = {};

		initialization();
	}

	safeOnMount(() => {
		elementTarget = document.querySelector(selector);

		if (!elementTarget) return;

		({ headingsList, elementsList } = generateInitialLists(elementTarget));

		initialization();

		mutationObserver = new MutationObserver(mutationHandler);
		mutationObserver.observe(elementTarget, { childList: true, subtree: true });

		return () => {
			observer?.disconnect();
			mutationObserver?.disconnect();
		};
	});

	// Elements
	const item = builder(name('item'), {
		stores: activeHeadingIdxs,
		returned: ($activeHeadingIdxs) => {
			return (id: string) => {
				const idx = headingsList.findIndex((heading) => heading.id === id);
				const active = $activeHeadingIdxs.includes(idx);

				return {
					'data-id': id,
					'data-active': active ? '' : undefined,
				};
			};
		},
		action: (node: HTMLAnchorElement) => {
			const id = node.getAttribute('data-id');

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					e.preventDefault();

					if (scrollFn) {
						scrollFn(`${id}`);
					} else {
						scrollToTargetAdjusted(`${id}`);
					}

					// Add items hash to URL
					if (id) {
						window.location.hash = id;
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	// Helpers
	const isActive = derived(activeHeadingIdxs, ($activeHeadingIdxs) => {
		return (headingId: string) => {
			const idx = headingsList.findIndex((heading) => heading.id === headingId);
			return $activeHeadingIdxs.includes(idx);
		};
	});

	return {
		elements: {
			item,
		},
		states: {
			activeHeadingIdxs,
			headingsTree,
		},
		helpers: {
			isActive,
		},
	};
}
