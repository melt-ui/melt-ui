import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getTabbableNodes,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';
import { derived, get, writable } from 'svelte/store';
import type { CreateNavigationMenuProps } from './types';
import { onDestroy } from 'svelte';
import { useClickOutside, useFocusOutside } from '@melt-ui/svelte/internal/actions';

const defaults = {
	delayMs: 200,
	skipDelayMs: 200,
	direction: 'ltr',
	orientation: 'horizontal',
	onValueChange: undefined,
	label: 'Main',
} satisfies CreateNavigationMenuProps;

type NavigationMenuParts =
	| 'submenu'
	| 'list'
	| 'item'
	| 'trigger'
	| 'link'
	| 'indicator'
	| 'content'
	| 'viewport';

type MotionAttribute = 'to-start' | 'to-end' | 'from-start' | 'from-end';

const { name, selector } = createElHelpers<NavigationMenuParts>('nav-menu');

export function createNavigationMenu(props?: CreateNavigationMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateNavigationMenuProps;

	const options = toWritableStores(withDefaults);
	const { delayMs, skipDelayMs, direction, orientation, label } = options;
	const openTimer = writable(0);
	const closeTimer = writable(0);
	const skipDelayTimer = writable(0);
	const isOpenDelayed = writable(true);

	const activeItem = writable<string>('');
	const previousItem = writable<string>('');

	const rootIds = {
		root: generateId(),
		viewport: generateId(),
	};

	onDestroy(() => {
		if (!isBrowser) return;
		window.clearTimeout(get(openTimer));
		window.clearTimeout(get(closeTimer));
		window.clearTimeout(get(skipDelayTimer));
	});

	const root = builder(name(), {
		stores: [orientation, direction, label],
		returned: ([$orientation, $direction, $label]) => {
			return {
				id: rootIds.root,
				'aria-label': $label,
				'data-orientation': $orientation,
				'data-direction': $direction,
				dir: $direction,
			};
		},
	});

	const size = writable<{ width: number; height: number } | null>(null);
	const content = writable<HTMLElement | null>(null);
	const viewportWidth = derived(size, ($size) => ($size ? $size.width + 'px' : undefined));
	const viewportHeight = derived(size, ($size) => ($size ? $size.height + 'px' : undefined));

	const open = derived(activeItem, ($activeItem) => {
		return $activeItem !== '';
	});

	function handleSizeChange() {
		const $content = get(content);
		if (!$content) return;
		size.set({ width: $content.offsetWidth, height: $content.offsetHeight });
	}

	const viewport = builder(name('viewport'), {
		stores: [open, orientation, viewportWidth, viewportHeight],
		returned: ([$open, $orientation, $viewportWidth, $viewportHeight]) => {
			return {
				id: rootIds.viewport,
				'data-state': getOpenState($open),
				'data-orientation': $orientation,
				style: styleToString({
					pointerEvents: !$open ? 'none' : undefined,
					['--melt-nav-menu-viewport-width']: $viewportWidth,
					['--melt-nav-menu-viewport-height']: $viewportHeight,
				}),
			};
		},
		action: (node: HTMLElement) => {
			const { destroy: unsubResizeObserver } = useResizeObserver(node, handleSizeChange);

			const unsub = executeCallbacks(
				addEventListener(node, 'pointerenter', () => onContentEnter()),
				addEventListener(node, 'pointerleave', (e) => {
					if (!isMouse(e)) return;
					onContentLeave();
				})
			);

			return {
				destroy() {
					unsubResizeObserver();
					unsub();
				},
			};
		},
	});

	function createMenuItem() {
		const open = writable<boolean>(false);
		const hasPointerMoveOpened = writable<boolean>(false);
		const wasClickClose = writable<boolean>(false);
		const wasEscapeClose = writable<boolean>(false);
		const restoreContentTabOrder = writable(noop);
		const isRootMenu = writable(true);
		const prevMotionAttribute = writable<MotionAttribute | null>(null);

		const ids = {
			item: generateId(),
			trigger: generateId(),
			content: generateId(),
		};

		const motionAttribute = writable<MotionAttribute | null>(
			(() => {
				if (!isBrowser) return null;
				const navMenu = document.getElementById(rootIds.root);
				if (!isHTMLElement(navMenu)) return;
				const items = getItems(navMenu);
				const values = items.map((item) => item.id);
				if (get(direction) === 'rtl') values.reverse();
				const $activeItem = get(activeItem);
				const index = values.indexOf($activeItem);
				const prevIndex = values.indexOf(get(previousItem));
				const isSelected = ids.item === $activeItem;
				const wasSelected = prevIndex === values.indexOf(ids.item);

				// We only want to update selected and the last selected content
				// this avoids animations being interrupted outside of that range
				if (!isSelected && !wasSelected) return get(prevMotionAttribute);

				const attribute = (() => {
					if (index !== prevIndex) {
						if (isSelected && prevIndex !== -1) {
							return index > prevIndex ? 'from-end' : 'from-start';
						}
						if (wasSelected && index !== -1) {
							return index > prevIndex ? 'to-start' : 'to-end';
						}
					}
					return null;
				})();

				prevMotionAttribute.set(attribute);
				return attribute;
			})()
		);

		const item = builder(name('item'), {
			stores: [orientation],
			returned: ([$orientation]) => {
				return {
					id: ids.item,
					'data-orientation': $orientation,
				};
			},
		});

		type NavMenuLinkProps = {
			active?: boolean;
		};

		const link = builder(name('link'), {
			returned: () => {
				return (props?: NavMenuLinkProps) => {
					const active = props?.active;
					return {
						'data-active': active ? '' : undefined,
						'aria-current': active ? 'page' : undefined,
					};
				};
			},
		});

		type TriggerProps = {
			disabled: boolean;
		};

		const defaultTriggerProps = {
			disabled: false,
		};

		const trigger = builder(name('trigger'), {
			stores: [open],
			returned: ([$open]) => {
				return (props?: TriggerProps) => {
					const { disabled } = { ...defaultTriggerProps, ...props };
					return {
						id: ids.trigger,
						disabled,
						'data-disabled': disabled ? '' : undefined,
						'data-state': getOpenState($open),
						'aria-expaned': $open,
						'aria-controls': ids.content,
					};
				};
			},
			action: (node: HTMLElement) => {
				const disabled = node.hasAttribute('data-disabled');

				const unsub = executeCallbacks(
					addEventListener(node, 'pointerenter', () => {
						wasClickClose.set(false);
						wasEscapeClose.set(false);
					}),
					addEventListener(node, 'pointermove', (e) => {
						if (!isMouse(e)) return;
						if (
							disabled ||
							get(wasClickClose) ||
							get(wasEscapeClose) ||
							get(hasPointerMoveOpened)
						) {
							return;
						}
						onTriggerEnter(ids.item);
						hasPointerMoveOpened.set(true);
					}),
					addEventListener(node, 'pointerleave', (e) => {
						if (!isMouse(e)) return;
						if (disabled) return;
						onTriggerLeave();
						hasPointerMoveOpened.set(false);
					}),
					addEventListener(node, 'click', () => {
						onItemSelect(ids.item);
						wasClickClose.set(get(open));
					}),
					addEventListener(node, 'keydown', (e) => {
						const verticalEntryKey = get(direction) === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT;
						const entryKey = {
							horizontal: kbd.ARROW_DOWN,
							vertical: verticalEntryKey,
						}[get(orientation)];

						if (get(open) && e.key === entryKey) {
							handleContentEntry();
							e.preventDefault();
						}
					})
				);
				return {
					destroy() {
						unsub();
					},
				};
			},
		});

		const content = builder(name('content'), {
			stores: [open, motionAttribute, orientation],
			returned: ([$open, $motionAttribute, $orientation]) => {
				return {
					id: ids.content,
					'data-motion': $motionAttribute,
					'data-orientation': $orientation,
					'data-state': getOpenState($open),
					style: styleToString({
						pointerEvents: !$open && get(isRootMenu) ? 'none' : undefined,
					}),
				};
			},
			action: (node: HTMLElement) => {
				const rootNavMenu = getRootNavMenu();
				if (!rootNavMenu) return;

				const { destroy: unsubClickOutside } = useClickOutside(node, {
					handler: (e) => {
						const target = e.target;
						if (!isHTMLElement(target)) return;
						const isTrigger = target.id === ids.trigger;
						// TODO: ADD VIEWPORT THING & Root Menu Check
						if (isTrigger) {
							e.preventDefault();
						}
					},
				});

				const { destroy: unsubFocusOutside } = useFocusOutside(node, {
					handler: (e) => {
						const target = e.target;
						if (!isHTMLElement(target)) return;
						const rootNavMenu = getRootNavMenu();
						if (!rootNavMenu) return;
						if (rootNavMenu.contains(target)) {
							e.preventDefault();
						}
					},
				});

				const unsub = executeCallbacks(
					addEventListener(node, 'pointerenter', () => onContentEnter()),
					addEventListener(node, 'pointerleave', (e) => {
						if (!isMouse(e)) return;
						onContentLeave();
					}),
					addEventListener(node, 'focusout', (e) => {
						handleContentExit();
						const target = e.target;
						if (!isHTMLElement(target)) return;
						const rootNav = getRootNavMenu();
						if (!rootNav) return;
						// Only dismiss content when focus moves outside the root nav menu
						if (rootNav.contains(target)) {
							e.preventDefault();
						}
					}),
					addEventListener(node, 'keydown', (e) => {
						const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
						const isTabKey = e.key === kbd.TAB && !isMetaKey;
						if (!isTabKey) return;

						const candidates = getTabbableNodes(node);
						const focusedElement = document.activeElement;
						const index = candidates.findIndex((candidate) => candidate === focusedElement);
						const isMovingBackwards = e.shiftKey;
						const nextCandidates = isMovingBackwards
							? candidates.slice(0, index).reverse()
							: candidates.slice(index + 1, candidates.length);

						if (focusFirst(nextCandidates)) {
							e.preventDefault();
						}
					})
				);
				return {
					destroy() {
						unsub();
						unsubClickOutside();
						unsubFocusOutside();
					},
				};
			},
		});

		function handleContentEntry(side = 'start') {
			const contentEl = document.getElementById(ids.content);
			if (!isHTMLElement(contentEl)) return;
			get(restoreContentTabOrder)();
			const candidates = getTabbableNodes(contentEl);
			if (candidates.length) {
				focusFirst(side === 'start' ? candidates : candidates.reverse());
			}
		}

		function handleContentExit() {
			const contentEl = document.getElementById(ids.content);
			if (!isHTMLElement(contentEl)) return;
			const candidates = getTabbableNodes(contentEl);
			if (candidates.length) {
				restoreContentTabOrder.set(removeFromTabOrder(candidates));
			}
		}

		return {
			elements: {
				trigger,
				item,
				content,
				link,
			},
		};
	}

	effect([activeItem], ([$activeItem]) => {
		if (!isBrowser) return;
		const isOpen = $activeItem !== '';
		const $skipDelayMs = get(skipDelayMs);
		const hasSkipDelay = $skipDelayMs > 0;

		if (isOpen) {
			window.clearTimeout(get(skipDelayTimer));
			if (hasSkipDelay) {
				isOpenDelayed.set(false);
			}
		} else {
			window.clearTimeout(get(skipDelayTimer));
			skipDelayTimer.set(window.setTimeout(() => isOpenDelayed.set(true), $skipDelayMs));
		}
	});

	function getRootNavMenu() {
		return document.getElementById(rootIds.root);
	}

	function onTriggerEnter(listId: string) {
		window.clearTimeout(get(openTimer));
		if (get(isOpenDelayed)) {
			handleDelayedOpen(listId);
		} else {
			handleOpen(listId);
		}
	}

	function onTriggerLeave() {
		window.clearTimeout(get(openTimer));
		startCloseTimer();
	}

	function onContentEnter() {
		window.clearTimeout(get(closeTimer));
	}

	function onContentLeave() {
		startCloseTimer();
	}

	function onItemSelect(listId: string) {
		activeItem.update((prev) => {
			if (prev === listId) {
				return '';
			}
			return listId;
		});
	}

	function handleOpen(listId: string) {
		window.clearTimeout(get(closeTimer));
		activeItem.set(listId);
	}

	function startCloseTimer() {
		window.clearTimeout(get(closeTimer));
		closeTimer.set(window.setTimeout(() => activeItem.set(''), 150));
	}

	function handleDelayedOpen(listId: string) {
		const isOpenList = get(activeItem) === listId;
		if (isOpenList) {
			// if the list is already open, i.e. we're transitioning from
			// the content to the trigger then we want to clear the close timer
			window.clearTimeout(get(closeTimer));
		} else {
			openTimer.set(
				window.setTimeout(() => {
					window.clearTimeout(get(closeTimer));
					activeItem.set(listId);
				}, get(delayMs))
			);
		}
	}
	function getItems(navMenu: HTMLElement) {
		return Array.from(navMenu.querySelectorAll(selector('item')));
	}

	return {
		elements: {
			root,
			viewport,
		},
		builders: {
			createMenuItem,
		},
		options,
	};
}

function getOpenState(open: boolean) {
	return open ? 'open' : 'closed';
}

function isMouse(e: PointerEvent) {
	return e.pointerType === 'mouse';
}

function focusFirst(candidates: HTMLElement[]) {
	const previouslyFocusedElement = document.activeElement;
	return candidates.some((candidate) => {
		// if focus is already where we want to go, we don't want to keep going through the candidates
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocusedElement;
	});
}

function removeFromTabOrder(candidates: HTMLElement[]) {
	candidates.forEach((candidate) => {
		candidate.dataset.tabindex = candidate.getAttribute('tabindex') || '';
		candidate.setAttribute('tabindex', '-1');
	});
	return () => {
		candidates.forEach((candidate) => {
			const prevTabIndex = candidate.dataset.tabindex;
			if (prevTabIndex) {
				candidate.setAttribute('tabindex', prevTabIndex);
			}
		});
	};
}

function useResizeObserver(node: HTMLElement, onResize: () => void) {
	const handleResize = onResize;
	let rAF = 0;

	const resizeObserver = new ResizeObserver(() => {
		cancelAnimationFrame(rAF);
		rAF = window.requestAnimationFrame(handleResize);
	});
	resizeObserver.observe(node);
	return {
		destroy() {
			window.cancelAnimationFrame(rAF);
			resizeObserver.unobserve(node);
		},
	};
}
