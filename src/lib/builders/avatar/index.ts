import { effect, isBrowser, styleToString } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable, derived, get } from 'svelte/store';

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error';

export type CreateAvatarArgs = {
	src: string;
};

const defaults = {
	src: '',
} satisfies Defaults<CreateAvatarArgs>;

export const createAvatar = (args: CreateAvatarArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const src = writable(withDefaults.src);

	const loadingStatus = writable<ImageLoadingStatus>('loading');

	const root = derived([src], () => {
		const rootStyles = styleToString({
			overflow: 'hidden',
		});
		return {
			style: rootStyles,
		};
	});

	effect([src], () => {
		if (isBrowser) {
			const image = new Image();
			image.src = get(src);
			image.onload = () => {
				loadingStatus.set('loaded');
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
		root,
		image,
		fallback,
	};
};
