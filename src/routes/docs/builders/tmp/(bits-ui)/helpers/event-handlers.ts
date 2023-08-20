export type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};

export type DivEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLDivElement;
};

export type SpanEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLSpanElement;
};
