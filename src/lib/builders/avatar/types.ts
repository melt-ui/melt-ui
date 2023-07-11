import type { createAvatar } from './create';

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error';

export type CreateAvatarProps = {
	src: string;
	delayMs?: number;
};

export type CreateAvatarReturn = ReturnType<typeof createAvatar>;
