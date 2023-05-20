<script lang="ts" context="module">
	import { reactiveContext } from '$lib/internal/helpers';
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';

	export type AvatarRootProps = BaseProps<'span'>;

	export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
	type AvatarRootContext = {
		imageLoadingStatus: ImageLoadingStatus;
	};

	const { getContext, setContext } = reactiveContext<AvatarRootContext>({
		imageLoadingStatus: 'idle',
	});
	export const getAvatarRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = AvatarRootProps;

	setContext();
</script>

<span {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</span>
