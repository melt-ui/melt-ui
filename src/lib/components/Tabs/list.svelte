<script lang="ts" context="module">
	import { next, prev } from '$lib/internal/helpers/array';
	import { collectionContext } from '$lib/internal/helpers/collectionContext';
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';
	import { getTabsRootContext } from './root.svelte';

	export type TabsListProps = BaseProps<'div'>;

	const triggerCollection = collectionContext();
	export const getTriggerCollection = triggerCollection.getContext;
</script>

<script lang="ts">
	type $$Props = TabsListProps;

	const rootCtx = getTabsRootContext();
	const triggerStore = triggerCollection.createContext();

	$: nextKey = {
		horizontal: $rootCtx.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
		vertical: 'ArrowDown',
	}[$rootCtx.orientation ?? 'horizontal'];

	$: prevKey = {
		horizontal: $rootCtx.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft',
		vertical: 'ArrowUp',
	}[$rootCtx.orientation ?? 'horizontal'];

	triggerStore.subscribe((triggers) => {
		triggers.forEach((trigger, index) => {
			trigger.addEventListener('keydown', (e) => {
				if (e.key === nextKey) {
					e.preventDefault();
					next(triggers, index)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(triggers, index)?.focus();
				}
			});
		});
	});
</script>

<div
	role="tablist"
	data-orientation={$rootCtx.orientation}
	{...$$restProps}
	use:useActions={$$restProps.use}
>
	<slot />
</div>
