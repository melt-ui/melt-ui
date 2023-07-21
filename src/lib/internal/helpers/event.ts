import type { Arrayable, MeltEvent } from '$lib/internal/types';
import { isHTMLElement } from './is';

/**
 * A type alias for a general event listener function.
 *
 * @template E - The type of event to listen for
 * @param evt - The event object
 * @returns The return value of the event listener function
 */
export type GeneralEventListener<E = Event> = (evt: E) => unknown;

/**
 *  Overloaded function signatures for addEventListener
 */
export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Window,
	event: E,
	handler: (this: Window, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Document,
	event: E,
	handler: (this: Document, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: EventTarget,
	event: E,
	handler: GeneralEventListener<HTMLElementEventMap[E]>,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

/**
 * Adds an event listener to the specified target element(s) for the given event(s), and returns a function to remove it.
 * @param target The target element(s) to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener from the target element(s).
 */
export function addEventListener(
	target: Window | Document | EventTarget,
	event: Arrayable<string>,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const events = Array.isArray(event) ? [...event] : [event];

	// Add the event listener to each specified event for the target element(s).
	events.forEach((_event) => target.addEventListener(_event, handler, options));

	// Return a function that removes the event listener from the target element(s).
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}

export type EventHandler<T extends Event = Event> = (event: T) => void;

export function dispatchMeltEvent(originalEvent: Event) {
	const node = originalEvent.currentTarget;
	if (!isHTMLElement(node)) return;

	const customMeltEvent: MeltEvent<typeof originalEvent> = new CustomEvent(
		`m-${originalEvent.type}`,
		{
			detail: {
				cancel: () => {
					originalEvent.preventDefault();
				},
				originalEvent,
			},
		}
	);

	node.dispatchEvent(customMeltEvent);
}

export function withMelt<E extends Event>(handler: EventHandler<E>) {
	return (event: E) => {
		dispatchMeltEvent(event);
		if (event.defaultPrevented) return;
		return handler(event);
	};
}
