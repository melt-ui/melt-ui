export type InteractOutsideEvent = PointerEvent | MouseEvent | TouchEvent;

export type InteractOutsideConfig = {
	onInteractOutside?: (e: InteractOutsideEvent) => void;
	onInteractOutsideStart?: (e: InteractOutsideEvent) => void;
	enabled?: boolean;
};
