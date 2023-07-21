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
