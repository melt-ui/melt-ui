import { isHTMLElement, kbd } from '$lib/internal/helpers/index.js';

/**
 * Given an event and the id of the segment container, navigate
 * to the next or previous segment depending on the key pressed.
 *
 * @param e - The keyboard event
 * @param containerId - The id of the container we're navigating within
 */
export function handleSegmentNavigation(e: KeyboardEvent, containerId: string) {
	const currentTarget = e.currentTarget;
	if (!isHTMLElement(currentTarget)) return;

	const { prev, next } = getPrevNextSegments(currentTarget, containerId);

	if (e.key === kbd.ARROW_LEFT) {
		if (!prev) return;
		prev.focus();
	} else if (e.key === kbd.ARROW_RIGHT) {
		if (!next) return;
		next.focus();
	}
}

/**
 * Gets the next segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're moving from
 * @param segments - The list of candidate segments to move to
 */
function getNextSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === segments.length - 1 || index === -1) return null;
	const nextIndex = index + 1;
	const nextSegment = segments[nextIndex];
	return nextSegment;
}

/**
 * Gets the prev segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're moving from
 * @param segments - The list of candidate segments to move to
 */
function getPrevSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === 0 || index === -1) return null;
	const prevIndex = index - 1;
	const prevSegment = segments[prevIndex];
	return prevSegment;
}

/**
 * Gets an object containing the next and previous segments
 * relative to the current node.
 *
 * @param node - The node we're moving from
 * @param containerId - The id of the container we're navigating within
 */
function getPrevNextSegments(node: HTMLElement, containerId: string) {
	const segments = getSegments(containerId);
	if (!segments.length) {
		return {
			next: null,
			prev: null,
		};
	}
	return {
		next: getNextSegment(node, segments),
		prev: getPrevSegment(node, segments),
	};
}

/**
 * Moves focus to the next segment in the list of segments
 * within the container with the provided id.
 */
export function moveToNextSegment(e: KeyboardEvent, containerId: string) {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	const { next } = getPrevNextSegments(node, containerId);
	if (!next) return;
	next.focus();
}

export function isSegmentNavigationKey(key: string) {
	if (key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT) return true;
	return false;
}

/**
 * Gets all the interactive segments within the
 * container with the provided id.
 */
export function getSegments(id: string) {
	const inputContainer = document.getElementById(id);
	if (!isHTMLElement(inputContainer)) return [];
	const segments = Array.from(inputContainer.querySelectorAll('[data-segment]')).filter(
		(el): el is HTMLElement => {
			if (!isHTMLElement(el)) return false;
			if (el.dataset.segment === 'literal') return false;
			return true;
		}
	);
	return segments;
}
