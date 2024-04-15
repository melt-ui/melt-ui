import type {
	Options as FocusTrapOptions,
	KeyboardEventToBoolean,
	MouseEventToBoolean,
} from 'focus-trap';

export type FocusTrapConfig = FocusTrapOptions & {
	/**
	 * Default: `false`. If `false`, when the trap is deactivated,
	 * focus will *not* return to the element that had focus before activation.
	 */
	returnFocusOnDeactivate?: boolean;
	/**
	 * Default: `false`. If `false` or returns `false`, the `Escape` key will not trigger
	 * deactivation of the focus trap. This can be useful if you want
	 * to force the user to make a decision instead of allowing an easy
	 * way out. Note that if a function is given, it's only called if the ESC key
	 * was pressed.
	 */
	escapeDeactivates?: boolean | KeyboardEventToBoolean;
	/**
	 * If set and is or returns `true`, a click outside the focus trap will not
	 * be prevented, even when `clickOutsideDeactivates` is `false`. When
	 * `clickOutsideDeactivates` is `true`, this option is **ignored** (i.e.
	 * if it's a function, it will not be called). Use this option to control
	 * if (and even which) clicks are allowed outside the trap in conjunction
	 * with `clickOutsideDeactivates: false`. Default: `true`.
	 */
	allowOutsideClick?: boolean | MouseEventToBoolean;
};
