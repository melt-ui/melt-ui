<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { slide, type SlideParams } from 'svelte/transition';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps & {
		transition?: boolean | SlideParams;
	};

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

	const { open, disabled } = getCollapsibleContext();
</script>

{#if $open}
	<div
		{...$$restProps}
		data-state={$open ? 'open' : 'closed'}
		data-disabled={$disabled ? 'true' : 'false'}
		transition:slide|local={transitionParams}
	>
		<slot />
	</div>
{/if}
