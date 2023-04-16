<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';

	export type AvatarRootProps = BaseProps<'span'>;

	export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
	type AvatarRootContext = {
		imageLoadingStatus: ImageLoadingStatus;
	};

	const { getContext, setContext } = reactiveContext<AvatarRootContext>();
	export const getAvatarRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = AvatarRootProps;

	setContext({
		imageLoadingStatus: ['idle'],
	});
</script>

<span {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</span>
