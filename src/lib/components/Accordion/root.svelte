<script lang="ts" context="module">
	import { collectionContext } from '$lib/internal/helpers/collectionContext';
	import { reactiveContext } from '$lib/internal/helpers';
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

	export type AccordionRootProps = BaseProps<'div'> & {
		disabled?: boolean;
	} & (SingleAccordionRootProps | MultipleAccordionRootProps);

	export type AccordionContext = {
		readonly type: Type;
		readonly disabled: boolean;
		value: AccordionRootProps['value'];
	};

	const { getContext, setContext, defaults } = reactiveContext<AccordionContext>({
		type: 'single',
		value: null,
		disabled: false,
	});
	export const getRootCtx = getContext;

	// Create a context for all trigger components
	const triggerCollectionContext = collectionContext();
	export const getTriggerCollection = triggerCollectionContext.getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/internal/types';

	type $$Props = AccordionRootProps;

	export let type: $$Props['type'] = defaults?.type;
	export let value: $$Props['value'] = defaults?.value;
	export let disabled: $$Props['disabled'] = defaults?.disabled;

	const ctx = setContext({ value: (v) => (value = v) });
	$: ctx.set({ type, value, disabled });

	triggerCollectionContext.setContext();
</script>

<div {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</div>
