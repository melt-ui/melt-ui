import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { IdObj } from '$lib/internal/helpers/index.js';
import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { LinkPreviewIdParts, createLinkPreview } from './create.js';
export type { LinkPreviewComponentEvents } from './events.js';
export type CreateLinkPreviewProps = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: ReadableProp<FloatingConfig>;

	/**
	 * Whether or not the linkpreview is open by default.
	 *
	 * @default false
	 */
	open?: ReadableProp<boolean>;

	/**
	 * The delay in milliseconds to hover before opening the linkpreview
	 *
	 * @default 700
	 */
	openDelay?: ReadableProp<number>;

	/**
	 * The delay in milliseconds after the pointer leaves the
	 * linkpreview before closing it.
	 *
	 * @default 300
	 */
	closeDelay?: ReadableProp<number>;

	/**
	 * Whether or not to close the linkpreview when the pointer is clicked
	 * outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: ReadableProp<boolean>;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ReadableProp<(event: PointerEvent) => void>;

	/**
	 * Whether or not to close the linkpreview when the escape key is pressed
	 * while it is open.
	 *
	 * @default true
	 */
	closeOnEscape?: ReadableProp<boolean>;

	/**
	 * The size of the optional arrow element in pixels
	 *
	 * @default 8
	 */
	arrowSize?: ReadableProp<number>;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<HTMLElement | string | null>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<LinkPreviewIdParts>>;
};

export type LinkPreview = BuilderReturn<typeof createLinkPreview>;
export type LinkPreviewElements = LinkPreview['elements'];
export type LinkPreviewOptions = LinkPreview['options'];
export type LinkPreviewStates = LinkPreview['states'];
