<script lang="ts" context="module">
	import { collectionContext } from '$lib/internal/helpers/collectionContext';
	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';
	import { useActions } from '$lib/internal/helpers/useActions';

	type Type = 'single' | 'multiple';

	type SingleAccordionRootProps = {
		type?: 'single';
		value?: string | null;
	};

	type MultipleAccordionRootProps = {
		type: 'multiple';
		value?: string[];
	};

	export type AccordionRootProps = BaseProps<'div'> &
		(SingleAccordionRootProps | MultipleAccordionRootProps);

	export type AccordionContext = {
		readonly type: Type;
		value: AccordionRootProps['value'];
	};

	const { getContext, setContext } = reactiveContext<AccordionContext>();
	export const getRootCtx = getContext;

	// Create a context for all trigger components
	const triggerCollectionContext = collectionContext();
	export const getTriggerCollection = triggerCollectionContext.getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/internal/types';

	type $$Props = AccordionRootProps;

	export let type: $$Props['type'] = 'single';
	export let value: $$Props['value'] = null;

	const contextStore = setContext({
		type: [type ?? 'single'],
		value: [value, (v) => (value = v)],
	});
	$: contextStore.set({ type: type ?? 'single', value });

	triggerCollectionContext.createContext();
</script>

<div {...$$restProps} use:useActions={$$restProps.use} data-radix-accordion-root>
	<slot />
</div>
