import type { createAvatar } from './create';
import type { BuilderReturn } from '$lib/internal/types';

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error';

export type CreateAvatarProps = {
	src: string;
	delayMs?: number;
};

export type Avatar = BuilderReturn<typeof createAvatar>;
export type AvatarElements = Avatar['elements'];
export type AvatarOptions = Avatar['options'];
export type AvatarStates = Avatar['states'];
