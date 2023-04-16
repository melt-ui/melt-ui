<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers/useActions';

	import { browser } from '$app/environment';
	import { isMountedStore } from '$lib/internal/stores';
	import type { BaseProps } from '$lib/internal/types';
	import { getAvatarRootContext, type ImageLoadingStatus } from './root.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Detailed } from '$lib/internal/types';

	export type AvatarImageProps = BaseProps<'img'> & {
		src?: string;
		alt?: string;
	};
</script>

<script lang="ts">
	type $$Props = AvatarImageProps;
	export let src: $$Props['src'] = undefined;
	export let alt: $$Props['alt'] = undefined;

	type $$Events = {
		loadingStatusChange: CustomEvent<ImageLoadingStatus>;
	};
	const dispatch = createEventDispatcher<Detailed<$$Events>>();

	$: if ($rootCtx.imageLoadingStatus !== 'idle') {
		dispatch('loadingStatusChange', $rootCtx.imageLoadingStatus);
	}

	const isMounted = isMountedStore();
	const rootCtx = getAvatarRootContext();

	function handleLoad(src: $$Props['src']) {
		if (!browser) return;
		if (!src) {
			$rootCtx.imageLoadingStatus = 'error';
			return;
		}

		const image = new window.Image();

		const updateStatus = (status: ImageLoadingStatus) => () => {
			if (!$isMounted) return;
			$rootCtx.imageLoadingStatus = status;
		};

		$rootCtx.imageLoadingStatus = 'loading';
		image.onload = updateStatus('loaded');
		image.onerror = updateStatus('error');
		image.src = src;
	}

	$: handleLoad(src);
</script>

{#if $rootCtx.imageLoadingStatus === 'loaded'}
	<img {src} {alt} {...$$restProps} use:useActions={$$restProps.use} />
{/if}
