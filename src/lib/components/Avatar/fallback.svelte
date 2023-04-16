<script lang="ts" context="module">
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';
	import { getAvatarRootContext } from './root.svelte';

	export type AvatarFallbackProps = BaseProps<'span'> & {
		delayMs?: number;
	};
</script>

<script lang="ts">
	type $$Props = AvatarFallbackProps;

	export let delayMs: $$Props['delayMs'] = 0;

	let canRender = !delayMs;

	let timeout: ReturnType<typeof setTimeout> | undefined;
	$: if (delayMs) {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			canRender = true;
		}, delayMs);
	} else {
		canRender = true;
	}

	const rootCtx = getAvatarRootContext();
</script>

{#if canRender && $rootCtx.imageLoadingStatus !== 'loaded'}
	<span {...$$restProps} use:useActions={$$restProps.use}>
		<slot />
	</span>
{/if}
