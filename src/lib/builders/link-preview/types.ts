import type { FloatingConfig, InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { LinkPreviewIdParts, createLinkPreview } from './create.js';
export type { LinkPreviewComponentEvents } from './events.js';
export type CreateLinkPreviewProps = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: FloatingConfig;

	/**
	 * Whether or not the linkpreview is open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * A controlled open state store for the linkpreview. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean>;

	/**
	 * A callback for when the open state changes
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * The delay in milliseconds to hover before opening the linkpreview
	 *
	 * @default 700
	 */
	openDelay?: number;

	/**
	 * The delay in milliseconds after the pointer leaves the
	 * linkpreview before closing it.
	 *
	 * @default 300
	 */
	closeDelay?: number;

	/**
	 * Whether or not to close the linkpreview when the pointer is clicked
	 * outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: InteractOutsideEvent) => void;

	/**
	 * Whether or not to close the linkpreview when the escape key is pressed
	 * while it is open.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether should prevent text selection overflowing the element when the element is the top layer.
	 *
	 * @defaultValue `true`
	 */
	preventTextSelectionOverflow?: boolean;

	/**
	 * The size of the optional arrow element in pixels
	 *
	 * @default 8
	 */
	arrowSize?: number;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<LinkPreviewIdParts>>;
};

export type LinkPreview = BuilderReturn<typeof createLinkPreview>;
export type LinkPreviewElements = LinkPreview['elements'];
export type LinkPreviewOptions = LinkPreview['options'];
export type LinkPreviewStates = LinkPreview['states'];
