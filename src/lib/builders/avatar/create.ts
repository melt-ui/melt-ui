import { builder, effect, isBrowser, styleToString } from '$lib/internal/helpers';
import { writable } from 'svelte/store';
import type { CreateAvatarProps, ImageLoadingStatus } from './types';

const defaults = {
	src: '',
} satisfies CreateAvatarProps;

export const createAvatar = (props: CreateAvatarProps = defaults) => {
	const withDefaults = { ...defaults, ...props };
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

	const image = builder('avatar-image', {
		stores: [src, loadingStatus],
		returned: ([$src, $loadingStatus]) => {
			const imageStyles = styleToString({
				display: $loadingStatus === 'loaded' ? 'block' : 'none',
			});
			return {
				src: $src,
				style: imageStyles,
			};
		},
	});

	const fallback = builder('avatar-fallback', {
		stores: [loadingStatus],
		returned: ([$loadingStatus]) => {
			return {
				style:
					$loadingStatus === 'loaded'
						? styleToString({
								display: 'none',
						  })
						: undefined,
				hidden: $loadingStatus === 'loaded' ? undefined : true,
			};
		},
	});

	return {
		image,
		fallback,
	};
};
