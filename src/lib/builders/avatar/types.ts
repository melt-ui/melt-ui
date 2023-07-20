import type { createAvatar } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

const imageLoadingStatus = ['loading', 'loaded', 'error'] as const;

export type ImageLoadingStatus = (typeof imageLoadingStatus)[number];

export type CreateAvatarProps = {
	src: string;
	delayMs?: number;
	loadingStatus?: Writable<ImageLoadingStatus>;
	onLoadingStatusChange?: ChangeFn<ImageLoadingStatus>;
};

export type Avatar = BuilderReturn<typeof createAvatar>;
export type AvatarElements = Avatar['elements'];
export type AvatarOptions = Avatar['options'];
export type AvatarStates = Avatar['states'];

/**
 * An (optional) function that is called when the loading status changes.
 * It receives an object with the previous and next loading status, the value returned
 * from this function will be set as the new loading status.
 */
export type AvatarOnLoadingStatusChange = ChangeFn<ImageLoadingStatus>;
