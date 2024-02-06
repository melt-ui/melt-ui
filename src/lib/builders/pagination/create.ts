import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	executeCallbacks,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, readonly, writable } from 'svelte/store';
import type { PaginationEvents } from './events.js';
import { getPageItems } from './helpers.js';
import type { CreatePaginationProps, Page } from './types.js';
import { withGet } from '$lib/internal/helpers/withGet.js';

const defaults = {
	perPage: 1,
	siblingCount: 1,
	defaultPage: 1,
} satisfies Defaults<CreatePaginationProps>;

type PaginationParts = 'page' | 'prev' | 'next';
const { name, selector } = createElHelpers<PaginationParts>('pagination');

export function createPagination(props: CreatePaginationProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreatePaginationProps;
	const pageWritable = withDefaults.page ?? writable(withDefaults.defaultPage);
	const page = overridable(pageWritable, withDefaults?.onPageChange);

	// options
	const options = toWritableStores(omit(withDefaults, 'page', 'onPageChange', 'defaultPage'));

	const { perPage, siblingCount, count } = options;

	const totalPages = withGet.derived([count, perPage], ([$count, $perPage]) => {
		return Math.ceil($count / $perPage);
	});

	const range = derived([page, perPage, count], ([$page, $perPage, $count]) => {
		const start = ($page - 1) * $perPage;
		const end = Math.min(start + $perPage, $count);
		return { start, end };
	});

	const root = makeElement(name(), {
		returned: () => ({
			'data-scope': 'pagination',
		}),
	});

	const pages = derived([page, totalPages, siblingCount], ([$page, $totalPages, $siblingCount]) => {
		return getPageItems({ page: $page, totalPages: $totalPages, siblingCount: $siblingCount });
	});

	const keydown = (e: KeyboardEvent) => {
		const thisEl = e.target;
		if (!isHTMLElement(thisEl)) return;

		const rootEl = thisEl.closest('[data-scope="pagination"]');
		if (!isHTMLElement(rootEl)) return;

		const triggers = Array.from(rootEl.querySelectorAll(selector('page'))).filter(
			(el): el is HTMLElement => isHTMLElement(el)
		);
		const prevButton = rootEl.querySelector(selector('prev'));
		const nextButton = rootEl.querySelector(selector('next'));

		if (isHTMLElement(prevButton)) {
			triggers.unshift(prevButton);
		}
		if (isHTMLElement(nextButton)) {
			triggers.push(nextButton);
		}
		const index = triggers.indexOf(thisEl);

		if (e.key === kbd.ARROW_LEFT && index !== 0) {
			e.preventDefault();
			triggers[index - 1].focus();
		} else if (e.key === kbd.ARROW_RIGHT && index !== triggers.length - 1) {
			e.preventDefault();
			triggers[index + 1].focus();
		} else if (e.key === kbd.HOME) {
			e.preventDefault();
			triggers[0].focus();
		} else if (e.key === kbd.END) {
			e.preventDefault();
			triggers[triggers.length - 1].focus();
		}
	};

	const pageTrigger = makeElement(name('page'), {
		stores: page,
		returned: ($page) => {
			return (pageItem: Page) => {
				return {
					'aria-label': `Page ${pageItem.value}`,
					'data-value': pageItem.value,
					'data-selected': pageItem.value === $page ? '' : undefined,
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<PaginationEvents['pageTrigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const value = node.dataset.value;
					if (!value || Number.isNaN(+value)) return;
					page.set(Number(value));
				}),
				addMeltEventListener(node, 'keydown', keydown)
			);

			return {
				destroy: unsub,
			};
		},
	});

	const prevButton = makeElement(name('prev'), {
		stores: page,
		returned: ($page) => {
			return {
				'aria-label': 'Previous',
				disabled: $page <= 1,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<PaginationEvents['prevButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					page.update((p) => Math.max(p - 1, 1));
				}),
				addMeltEventListener(node, 'keydown', keydown)
			);

			return {
				destroy: unsub,
			};
		},
	});

	const nextButton = makeElement(name('next'), {
		stores: [page, totalPages],
		returned: ([$page, $totalPages]) => {
			return {
				'aria-label': 'Next',
				disabled: $page >= $totalPages,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<PaginationEvents['nextButton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const $totalPages = totalPages.get();
					page.update((p) => Math.min(p + 1, $totalPages));
				}),
				addMeltEventListener(node, 'keydown', keydown)
			);

			return {
				destroy: unsub,
			};
		},
	});

	return {
		elements: {
			root,
			pageTrigger,
			prevButton,
			nextButton,
		},
		states: {
			range: readonly(range),
			page: page,
			pages: readonly(pages),
			totalPages: readonly(totalPages),
		},
		options,
	};
}
