type FocusTarget = string | HTMLElement | SVGElement | null;

export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement) => FocusTarget);
