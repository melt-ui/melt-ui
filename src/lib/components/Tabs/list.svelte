<script lang="ts" context="module">
	import { next, prev } from '$lib/helpers/array';
	import { collectionContext } from '$lib/helpers/collectionContext';
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';

	export type TabsListProps = BaseProps<'div'>;

	const triggerCollection = collectionContext();
	export const getTriggerCollection = triggerCollection.getContext;
</script>

<script lang="ts">
	type $$Props = TabsListProps;

	const triggerStore = triggerCollection.createContext();

	triggerStore.subscribe((triggers) => {
		triggers.forEach((trigger, index) => {
			trigger.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowRight') {
					next(triggers, index)?.focus();
				} else if (e.key === 'ArrowLeft') {
					prev(triggers, index)?.focus();
				}
			});
		});
	});
</script>

<div role="tablist" {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</div>
