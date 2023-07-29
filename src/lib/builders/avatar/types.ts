import type { createAvatar } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

const imageLoadingStatus = ['loading', 'loaded', 'error'] as const;

export type ImageLoadingStatus = (typeof imageLoadingStatus)[number];

export type CreateAvatarProps = {
	/**
	 * The source of the image to display.
	 */
	src: string;

	/**
	 * The amount of time in milliseconds to wait before displaying the image.
	 *
	 * @default 0
	 */
	delayMs?: number;

	/**
	 * The controlled loading status store for the avatar.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	loadingStatus?: Writable<ImageLoadingStatus>;

	/**
	 * A callback invoked when the loading status store of the avatar changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onLoadingStatusChange?: ChangeFn<ImageLoadingStatus>;
};

export type Avatar = BuilderReturn<typeof createAvatar>;
export type AvatarElements = Avatar['elements'];
export type AvatarOptions = Avatar['options'];
export type AvatarStates = Avatar['states'];
