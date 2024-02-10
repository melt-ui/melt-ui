import { effect, isBrowser, makeElement, styleToString } from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { CreateAvatarProps } from './types.js';

const defaults = {
	src: '',
	delayMs: 0,
	loadingStatus: undefined,
} satisfies CreateAvatarProps;

export const createAvatar = (props?: CreateAvatarProps) => {
	const { loadingStatus, ...options } = parseProps(props, defaults);
	const { src, delayMs } = options;

	effect([src, delayMs], ([$src, $delayMs]) => {
		if (isBrowser) {
			const image = new Image();
			image.src = $src;
			image.onload = () => {
				if (delayMs !== undefined) {
					const timerId = window.setTimeout(() => {
						loadingStatus.set('loaded');
					}, $delayMs);
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

	const image = makeElement('avatar-image', {
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

	const fallback = makeElement('avatar-fallback', {
		stores: [loadingStatus],
		returned: ([$loadingStatus]) => {
			return {
				style:
					$loadingStatus === 'loaded'
						? styleToString({
								display: 'none',
						  })
						: undefined,
				hidden: $loadingStatus === 'loaded' ? true : undefined,
			};
		},
	});

	return {
		elements: {
			image,
			fallback,
		},
		states: {
			loadingStatus,
		},
		options,
	};
};
