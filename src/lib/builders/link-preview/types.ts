import type {
	EscapeBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
	PortalConfig,
} from '$lib/internal/actions/index.js';
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
	positioning?: FloatingConfig | undefined;

	/**
	 * Whether or not the linkpreview is open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean | undefined;

	/**
	 * A controlled open state store for the linkpreview. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean> | undefined;

	/**
	 * A callback for when the open state changes
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean> | undefined;

	/**
	 * The delay in milliseconds to hover before opening the linkpreview
	 *
	 * @default 700
	 */
	openDelay?: number | undefined;

	/**
	 * The delay in milliseconds after the pointer leaves the
	 * linkpreview before closing it.
	 *
	 * @default 300
	 */
	closeDelay?: number | undefined;

	/**
	 * Whether or not to close the linkpreview when the pointer is clicked
	 * outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean | undefined;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ((event: InteractOutsideEvent) => void) | undefined;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	escapeBehavior?: EscapeBehaviorType | undefined;

	/**
	 * Whether should prevent text selection overflowing the element when the element is the top layer.
	 *
	 * @defaultValue `true`
	 */
	preventTextSelectionOverflow?: boolean | undefined;

	/**
	 * The size of the optional arrow element in pixels
	 *
	 * @default 8
	 */
	arrowSize?: number | undefined;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean | undefined;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: PortalConfig | null | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<LinkPreviewIdParts>> | undefined;
};

export type LinkPreview = BuilderReturn<typeof createLinkPreview>;
export type LinkPreviewElements = LinkPreview['elements'];
export type LinkPreviewOptions = LinkPreview['options'];
export type LinkPreviewStates = LinkPreview['states'];
