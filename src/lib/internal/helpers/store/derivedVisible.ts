import { derived, type Writable } from 'svelte/store';

type DerivedVisibleObj = {
	open: Writable<boolean>;
	forceVisible: Writable<boolean>;
	activeTrigger: Writable<HTMLElement | null>;
};

/**
 * Helper function to standardize the way we derive a visible state for the
 * popper/floating elements.
 */
export function derivedVisible(obj: DerivedVisibleObj) {
	const { open, forceVisible, activeTrigger } = obj;
	return derived(
		[open, forceVisible, activeTrigger],
		([$open, $forceVisible, $activeTrigger]) => ($open || $forceVisible) && $activeTrigger !== null
	);
}
