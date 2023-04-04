<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';

	type Type = 'single' | 'multiple';

	type SingleAccordionRootProps = {
		type?: 'single';
		value?: string | null;
	};

	type MultipleAccordionRootProps = {
		type: 'multiple';
		value?: string[];
	};

	export type AccordionRootProps = BaseProps &
		(SingleAccordionRootProps | MultipleAccordionRootProps);

	export type AccordionContext = {
		type: Type;
		value: AccordionRootProps['value'];
	};

	const { getContext, setContext } = reactiveContext<AccordionContext>();
	export const getAccordionContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';

	type $$Props = AccordionRootProps;

	export let type: $$Props['type'] = 'single';
	export let value: $$Props['value'] = null;

	const setContextStores = setContext({
		type: [type ?? 'single', (v) => (type = v)],
		value: [value, (v) => (value = v)]
	});
	$: setContextStores({ type: type ?? 'single', value });
</script>

<div {...$$restProps} data-radix-accordion-root>
	<slot />
</div>
