<script lang="ts" context="module">
	export type CollapsibleContentProps = BaseProps & {
		transition?: boolean | SlideParams;
	};
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { slide, type SlideParams } from 'svelte/transition';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = CollapsibleContentProps;

	export let transition: $$Props['transition'] = undefined;

	$: transitionParams = (function getParams(): SlideParams {
		if (!transition) {
			return {
				duration: 0
			};
		}

		let transitionObj = typeof transition === 'object' ? transition : {};
		return {
			duration: 300,
			...transitionObj
		};
	})();

	const ctx = getCollapsibleContext();
</script>

{#if $ctx.open}
	<div
		{...$$restProps}
		data-state={$ctx.open ? 'open' : 'closed'}
		data-disabled={$ctx.disabled ? 'true' : 'false'}
		transition:slide|local={transitionParams}
	>
		<slot />
	</div>
{/if}
