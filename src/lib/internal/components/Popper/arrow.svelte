<script lang="ts" context="module">
	import { Arrow, type ArrowRootProps } from '$lib/components/Arrow';
	import { getPopperContentContext } from './content.svelte';
	import { getRootContext } from './root.svelte';

	export type PopperArrowProps = ArrowRootProps;
</script>

<script lang="ts">
	type $$Props = PopperArrowProps;

	const OPPSITE_SIDE = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right',
	};

	const contentContext = getPopperContentContext();
	const rootContext = getRootContext();
	$: baseSide = OPPSITE_SIDE[$contentContext.placedSide];
</script>

<span
	bind:this={$rootContext.arrow}
	style="{baseSide}: 0;"
	style:position="absolute"
	style:left={$contentContext.arrowX + 'px'}
	style:top={$contentContext.arrowY + 'px'}
	style:transform-origin={{
		top: '',
		right: '0 0',
		bottom: 'center 0',
		left: '100% 0',
	}[$contentContext.placedSide]}
	style:transform={{
		top: 'translateY(100%)',
		right: 'translateY(50%) rotate(90deg) translateX(-50%)',
		bottom: `rotate(180deg)`,
		left: 'translateY(50%) rotate(-90deg) translateX(50%)',
	}[$contentContext.placedSide]}
	style:visibility={$contentContext.shouldHideArrow ? 'hidden' : 'initial'}
>
	<Arrow.Root {...$$restProps} style="{$$restProps.style ?? ''}; display:block" />
</span>
