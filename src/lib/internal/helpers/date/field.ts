import { isAnySegmentPart } from '$lib/builders/date-field/_internal/helpers.js';
import { isHTMLElement, kbd } from '$lib/internal/helpers/index.js';

/**
 * Handles segment navigation based on the provided keyboard event and field ID.
 *
 * @param e - The keyboard event
 * @param fieldId - The ID of the field we're navigating within
 */
export function handleSegmentNavigation(e: KeyboardEvent, fieldId: string) {
	const currentTarget = e.currentTarget;
	if (!isHTMLElement(currentTarget)) return;

	const { prev, next } = getPrevNextSegments(currentTarget, fieldId);

	if (e.key === kbd.ARROW_LEFT) {
		if (!prev) return;
		prev.focus();
	} else if (e.key === kbd.ARROW_RIGHT) {
		if (!next) return;
		next.focus();
	}
}

/**
 * Retrieves the next segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're starting from
 * @param segments - The list of candidate segments to navigate through
 */
export function getNextSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === segments.length - 1 || index === -1) return null;
	const nextIndex = index + 1;
	const nextSegment = segments[nextIndex];
	return nextSegment;
}

/**
 * Retrieves the previous segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're starting from
 * @param segments - The list of candidate segments to navigate through
 */
export function getPrevSegment(node: HTMLElement, segments: HTMLElement[]) {
	const index = segments.indexOf(node);
	if (index === 0 || index === -1) return null;
	const prevIndex = index - 1;
	const prevSegment = segments[prevIndex];
	return prevSegment;
}

/**
 * Retrieves an object containing the next and previous segments relative to the current node.
 *
 * @param node - The node we're starting from
 * @param fieldId - The ID of the field we're navigating within
 */
export function getPrevNextSegments(node: HTMLElement, fieldId: string) {
	const segments = getSegments(fieldId);
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
 * Shifts the focus to the next segment in the list of segments
 * within the field identified by the provided ID.
 */
export function moveToNextSegment(e: KeyboardEvent, fieldId: string) {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	const { next } = getPrevNextSegments(node, fieldId);
	if (!next) return;
	next.focus();
}

export function isSegmentNavigationKey(key: string) {
	if (key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT) return true;
	return false;
}

/**
 * Retrieves all the interactive segments within the field identified by the provided ID.
 */
export function getSegments(id: string) {
	const inputContainer = document.getElementById(id);
	if (!isHTMLElement(inputContainer)) return [];
	const segments = Array.from(inputContainer.querySelectorAll('[data-segment]')).filter(
		(el): el is HTMLElement => {
			if (!isHTMLElement(el)) return false;
			const segment = el.dataset.segment;
			if (segment === 'trigger') return true;
			if (!isAnySegmentPart(segment) || segment === 'literal') return false;
			return true;
		}
	);
	return segments;
}

/**
 * Get the first interactive segment within the field identified by the provided ID.
 */
export function getFirstSegment(id: string) {
	const segments = getSegments(id);
	return segments[0];
}
