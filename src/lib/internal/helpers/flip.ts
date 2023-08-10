import { flatArray } from './array';

export interface AnimationElement extends HTMLElement {
	// True while this element is being animated
	isAnimating?: boolean;
	// Stores the final position of the animation
	finalPosition?: FlipRect;
	// Holds the
	animationResetTimer?: number;
	currentAnimation?: Animation;
}

type FlipTargets = Element | Element[] | string | NodeListOf<HTMLElement> | HTMLCollection;
type FlipRect = { top: number; left: number; width: number; height: number };
export type FlipState = Map<AnimationElement, FlipRect>;

/**
 * Get the BEFORE state of the target elements. This should be called before moving 1 or more
 * elements in the DOM.
 *
 * It supports rerunning with elements already animating, by setting the before position as
 * the current position of the animation.
 *
 * @param {FlipTargets} targets - The targets to include in the flip animation (if they have
 * moved in the DOM).
 *
 * @returns {FlipState} - The state of the targets as a Map object.
 **/
export function getState(targets: FlipTargets): FlipState {
	// Flatten the targets to an array
	const arr = flatArray(targets);

	// Create the FlipState map by iterating over the array, storing the element and
	// 'before' state.
	const items: FlipState = new Map();
	arr.forEach((el: AnimationElement) => {
		const { top, left, width, height } = el.getBoundingClientRect();

		// When animating, set the before as the current position + the transform offset
		if (el.isAnimating) {
			const transform = getTransform(el);
			items.set(el, {
				top: top + transform.y,
				left: left + transform.x,
				width,
				height,
			});
		} else {
			items.set(el, { top, left, width, height });
		}
	});

	return items;
}

/**
 * Animates the elements stored in the state object. This should be called after moving 1 or
 * more of the targeted elements in the DOM.
 *
 * @param {FlipState} state - The state object containing the elements to animate and their
 * before state.
 * @param {number} [duration=150] - The duration of the animation in milliseconds.
 * @param {string} [easing='ease-in-out'] - The easing function to use for the animation.
 **/
export function animate(state: FlipState, duration = 150, easing = 'ease-in-out') {
	for (const [el, beforeRect] of state.entries()) {
		// Get the elements current position
		const nowRect: FlipRect = el.getBoundingClientRect();

		// Do nothing when element is at its final position, for example, elements that are not
		// being animated
		const deltaX = beforeRect.left - nowRect.left;
		const deltaY = beforeRect.top - nowRect.top;
		if (deltaX === 0 && deltaY === 0) continue;

		// When the element is currently animating and the final position has not changed,
		// continue with the existing animation.
		if (
			el.isAnimating &&
			el.finalPosition &&
			Math.round(el.finalPosition.left) === Math.round(nowRect.left - deltaX) &&
			Math.round(el.finalPosition.top) === Math.round(nowRect.top - deltaY)
		) {
			continue;
		}

		// Mark this element as animating and store the final position
		el.isAnimating = true;
		el.finalPosition = nowRect;

		if (el.currentAnimation) {
			el.currentAnimation.cancel();
		}

		// Animate
		el.currentAnimation = el.animate(
			[
				{
					transformOrigin: 'top left',
					transform: `translate(${deltaX}px, ${deltaY}px)`,
				},
				{
					transformOrigin: 'top left',
					transform: 'none',
				},
			],
			{
				duration: duration > 0 ? duration : 0,
				easing: easing ? easing : undefined,
			}
		);

		// When the animation finishes, clear the isAnimating flag and the currentAnimation reference
		el.currentAnimation.onfinish = () => {
			el.isAnimating = false;
			el.currentAnimation = undefined;
		};
	}

	state.clear();
}

/**
 * Retrieves the transform coordinates (x and y) of the specified element for an animation
 * using a matrix function.
 *
 * @param {AnimationElement} el - The element to retrieve the transform coordinates from.
 *
 * @returns {Object} - An object containing the x and y coordinates of the element's transform.
 * @property {number} x - The x coordinate (matrix.e)
 * @property {number} y - The y coordinate (matrix.f)
 * */
function getTransform(el: AnimationElement): { x: number; y: number } {
	const matrixFn = window.DOMMatrix || window.WebKitCSSMatrix;
	if (!matrixFn) return { x: 0, y: 0 };

	const style = window.getComputedStyle(el);
	const matrix = new matrixFn(style.transform);
	return { x: matrix.e, y: matrix.f };
}
