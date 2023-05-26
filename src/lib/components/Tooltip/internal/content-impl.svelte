<script lang="ts" context="module">
	import { Popper, type PopperContentProps } from '$lib/internal/components/Popper';
	import { useActions } from '$lib/internal/helpers';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getTooltipRootContext } from '../root.svelte';
	import { TOOLTIP_OPEN } from '../constants';
	import { dismissable, type ForwardedEvent } from '$lib/internal/actions';
	import type { UnwrapCustomEvents } from '$lib/internal/types';

	export type TooltipContentImplProps = PopperContentProps;
</script>

<script lang="ts">
	type $$Props = TooltipContentImplProps;
	type $$Events = {
		pointerDownOutside: ForwardedEvent<MouseEvent>;
		escapeKeyDown: ForwardedEvent<KeyboardEvent>;
	};
	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	export let use: $$Props['use'] = [];

	const rootCtx = getTooltipRootContext();

	onMount(() => {
		document.addEventListener(TOOLTIP_OPEN, $rootCtx.onClose);
		return () => {
			document.removeEventListener(TOOLTIP_OPEN, $rootCtx.onClose);
		};
	});

	const handleScroll = (event: Event) => {
		const target = event.target as HTMLElement;
		if (target?.contains($rootCtx.trigger)) $rootCtx.onClose();
	};

	$: {
		window.removeEventListener('scroll', handleScroll, { capture: true });
		if ($rootCtx.trigger) {
			window.addEventListener('scroll', handleScroll, { capture: true });
		}
	}

	const onPointerDownOutside = (event: ForwardedEvent<MouseEvent>) => {
		dispatch('pointerDownOutside', event.detail);
	};

	const onEscapeKeyDown = (event: ForwardedEvent<KeyboardEvent>) => {
		dispatch('escapeKeyDown', event.detail);
	};
</script>

<Popper.Content
	{...$$restProps}
	use={[
		...(use ?? []),
		[
			dismissable,
			{
				onPointerDownOutside,
				onEscapeKeyDown,
				onDismiss: $rootCtx.onClose,
			},
		],
	]}
	data-state={$rootCtx.stateAttribute}
>
	<!-- TODO: Implement visually hidden -->
	<slot />aa
</Popper.Content>
