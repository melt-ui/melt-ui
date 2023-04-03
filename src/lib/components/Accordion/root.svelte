<script lang="ts" context="module">
	import { controllableState } from '$lib/helpers/controllableState';
	import { uniqueContext } from '$lib/helpers/uniqueContext';

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
		type: Readable<Type>;
		value: Writable<AccordionRootProps['value']>;
	};

	const { getContext, setContext } = uniqueContext<AccordionContext>();
	export const getAccordionContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	type $$Props = AccordionRootProps;

	export let type: $$Props['type'] = 'single';
	const writableType = writable(type);
	$: if (type) $writableType = type;

	export let value: $$Props['value'] = null;
	const writableValue = controllableState(value, (v) => (value = v));
	$: if (value) $writableValue = value;

	setContext({
		type: derived(writableType, (v) => v),
		value: writableValue
	});
</script>

<div {...$$restProps}>
	<slot />
</div>
