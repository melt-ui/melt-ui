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

	// Trigger logic
	const triggerStore = triggerCollection.setContext();

	$: nextKey = {
		horizontal: $rootCtx.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
		vertical: 'ArrowDown',
	}[$rootCtx.orientation ?? 'horizontal'];

	$: prevKey = {
		horizontal: $rootCtx.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft',
		vertical: 'ArrowUp',
	}[$rootCtx.orientation ?? 'horizontal'];

	const listeners = new Map();
	triggerStore.subscribe((triggers) => {
		const enabledTriggers = triggers.filter((t) => !t.dataset.disabled);

		triggers.forEach((trigger, index) => {
			const prevCallback = listeners.get(index);
			if (prevCallback) {
				trigger.removeEventListener('keydown', prevCallback);
			}

			const enabledIdx = enabledTriggers.indexOf(trigger);
			const listener = (e: KeyboardEvent) => {
				if (e.key === nextKey) {
					e.preventDefault();
					next(enabledTriggers, enabledIdx)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(enabledTriggers, enabledIdx)?.focus();
				}
			};
			listeners.set(index, listener);
			trigger.addEventListener('keydown', listener);
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
