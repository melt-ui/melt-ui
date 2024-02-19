import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createAvatar } from './create.js';

const imageLoadingStatus = ['loading', 'loaded', 'error'] as const;

export type ImageLoadingStatus = (typeof imageLoadingStatus)[number];

export type CreateAvatarProps = {
	/**
	 * The source of the image to display.
	 */
	src: ReadableProp<string>;

	/**
	 * The amount of time in milliseconds to wait before displaying the image.
	 *
	 * @default 0
	 */
	delayMs?: ReadableProp<number>;

	/**
	 * The controlled loading status for the avatar.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	loadingStatus?: ReadableProp<ImageLoadingStatus>;
};

export type Avatar = BuilderReturn<typeof createAvatar>;
export type AvatarElements = Avatar['elements'];
export type AvatarOptions = Avatar['options'];
export type AvatarStates = Avatar['states'];
