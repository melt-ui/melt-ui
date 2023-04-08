<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getDialogRootContext } from './root.svelte';

	export type DialogTitleProps = BaseProps<HTMLHeadingElement>;
</script>

<script lang="ts">
	type $$Props = DialogTitleProps;

	const rootCtx = getDialogRootContext();
</script>

<h2 id={$rootCtx.titleId} {...$$restProps}>
	<slot />
</h2>
