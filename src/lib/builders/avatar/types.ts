import type { createAvatar } from './create';
import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error';

export type CreateAvatarProps = {
	src: string;
	delayMs?: number;
};

export type Avatar = BuilderReturn<typeof createAvatar>;
export type AvatarElements = BuilderElements<Avatar>;
export type AvatarOptions = BuilderOptions<Avatar>;
export type AvatarStates = BuilderStates<Avatar>;
