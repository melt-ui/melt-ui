import type { ActivateOptions, DeactivateOptions, Options as FocusTrapOptions } from 'focus-trap';
import type { Action } from 'svelte/action';
import type { Readable } from 'svelte/store';

export interface FocusTrapConfig extends FocusTrapOptions {
	/**
	 * Immediately activate the trap
	 */
	immediate?: boolean;
}

export type FocusTrapReturn = {
	/**
	 * Indicates if the focus trap is currently active.
	 */
	hasFocus: Readable<boolean>;

	/**
	 * Indicates if the focus trap is currently paused.
	 */
	isPaused: Readable<boolean>;

	/**
	 * Activate the focus trap.
	 *
	 * @see https://github.com/focus-trap/focus-trap#trapactivateactivateoptions
	 */
	activate: (opts?: ActivateOptions) => void;

	/**
	 * Deactivate the focus trap.
	 *
	 * @see https://github.com/focus-trap/focus-trap#trapdeactivatedeactivateoptions
	 */
	deactivate: (opts?: DeactivateOptions) => void;

	/**
	 * Pause the focus trap.
	 *
	 * @see https://github.com/focus-trap/focus-trap#trappause
	 */
	pause: () => void;

	/**
	 * Unpauses the focus trap.
	 *
	 * @see https://github.com/focus-trap/focus-trap#trapunpause
	 */
	unpause: () => void;

	/**
	 * Action to attach to the element that you want to act as a focus trap.
	 */
	useFocusTrap: Action<HTMLElement, void>;
};
