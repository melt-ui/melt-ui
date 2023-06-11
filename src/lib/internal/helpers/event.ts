import type { Arrayable } from '$lib/internal/types';

// Function that dispatches and handles a custom event
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
 * Adds an event listener to an element, and returns a function to remove it.
 */
export function addEventListener(
	target: Window | Document | EventTarget,
	event: Arrayable<string>,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const events = Array.isArray(event) ? [...event] : [event];

	events.forEach((_event) => target.addEventListener(_event, handler, options));
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}
