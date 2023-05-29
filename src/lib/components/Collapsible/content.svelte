<script lang="ts" context="module">
	export type CollapsibleContentProps = BaseProps & {
		transition?: boolean | SlideParams;
	};
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/internal/types';
	import { slide, type SlideParams } from 'svelte/transition';
	import { getCollapsibleRootContext } from './root.svelte';
	import { useActions } from '$lib/internal/helpers/useActions';

	type $$Props = CollapsibleContentProps;

	export let transition: $$Props['transition'] = undefined;

	$: transitionParams = (function getParams(): SlideParams {
		if (!transition) {
			return {
				duration: 0,
			};
		}

		let transitionObj = typeof transition === 'object' ? transition : {};
		return {
			duration: 300,
			...transitionObj,
		};
	})();

	const ctx = getCollapsibleRootContext();
	$: ({ content, open } = $ctx);
</script>

{#if $open}
	<div
		{...$$restProps}
		{...$content}
		use:useActions={$$restProps.use}
		transition:slide|local={transitionParams}
	>
		<slot />
	</div>
{/if}
