import { effect, isBrowser, styleToString } from '$lib/internal/helpers';
import { writable, derived } from 'svelte/store';

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error';

export type CreateAvatarArgs = {
	src: string;
	delayMs?: number;
};

const defaults = {
	src: '',
} satisfies CreateAvatarArgs;

export const createAvatar = (args: CreateAvatarArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const { delayMs } = withDefaults;

	const src = writable(withDefaults.src);

	const loadingStatus = writable<ImageLoadingStatus>('loading');

	effect([src], ([$src]) => {
		if (isBrowser) {
			const image = new Image();
			image.src = $src;
			image.onload = () => {
				if (delayMs !== undefined) {
					const timerId = window.setTimeout(() => {
						loadingStatus.set('loaded');
					}, delayMs);
					return () => window.clearTimeout(timerId);
				} else {
					loadingStatus.set('loaded');
				}
			};
			image.onerror = () => {
				loadingStatus.set('error');
			};
		}
	});

	const image = derived([src, loadingStatus], ([$src, $loadingStatus]) => {
		const imageStyles = styleToString({
			display: $loadingStatus === 'loaded' ? 'block' : 'none',
		});
		return {
			src: $src,
			style: imageStyles,
		};
	});

	const fallback = derived([loadingStatus], ([$loadingStatus]) => {
		const fallbackStyles = styleToString({
			display: $loadingStatus === 'loaded' ? 'none' : 'block',
		});
		return {
			style: fallbackStyles,
		};
	});

	return {
		image,
		fallback,
	};
};
