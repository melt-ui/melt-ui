import type { Arrayable } from '$lib/internal/types';

/**
 * Handles and dispatches a custom event with the given name and detail.
 *
 * @template E - The type of the custom event to handle and dispatch
 * @template OriginalEvent - The type of the original event that triggered the custom event
 * @param name - The name of the custom event to handle and dispatch
 * @param handler - The function to call when the custom event is triggered
 * @param detail - An object containing the detail of the custom event
 * @param detail.originalEvent - The original event that triggered the custom event
 */
export function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
	name: string,
	handler: ((event: E) => void) | undefined,
	detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never)
) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, { cancelable: true, detail });
	if (handler) target.addEventListener(name, handler as EventListener, { once: true });

	target.dispatchEvent(event);
}
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
export function addEventListener<E extends keyof WindowEventMap>(
	target: Window,
	event: Arrayable<E>,
	handler: (this: Window, ev: WindowEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof DocumentEventMap>(
	target: Document,
	event: Arrayable<E>,
	handler: (this: Document, ev: DocumentEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<EventType = Event>(
	target: EventTarget,
	event: Arrayable<string>,
	handler: GeneralEventListener<EventType>,
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
