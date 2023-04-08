<script lang="ts" context="module">
	import { useActions } from '$lib/helpers/useActions';
	import type { BaseProps } from '$lib/types';
	export type SliderTrackProps = BaseProps<HTMLSpanElement>;
</script>

<script lang="ts">
	import { getRootContext } from './root.svelte';
	type $$Props = SliderTrackProps;
	const rootCtx = getRootContext();
</script>

<span
	{...$$restProps}
	use:useActions={$$restProps.use}
	data-disabled={$rootCtx.disabled ? '' : undefined}
	data-orientation={$rootCtx.orientation}
>
	<slot />
</span>
