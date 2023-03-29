<script lang="ts" context="module">
	import { controllableState } from '$lib/helpers/controllableState';
	import { uniqueContext } from '$lib/helpers/uniqueContext';

	type Type = 'single' | 'multiple';

	export type AccordionContext = {
		type: Readable<Type>;
		value: Writable<string | null | undefined>;
	};

	const { getContext, setContext } = uniqueContext<AccordionContext>();
	export const getAccordionContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	type $$Props = BaseProps & {
		type?: Type;
		value?: string | null;
	};

	export let type: $$Props['type'] = 'single';
	const writableType = writable(type);
	$: if (type) $writableType = type;

	export let value: $$Props['value'] = '';
	const writableValue = controllableState<$$Props['value']>(value, (v) => (value = v));
	$: if (value) $writableValue = value;

	setContext({
		type: derived(writableType, (v) => v),
		value: writableValue
	});
</script>

<div {...$$restProps}>
	<slot />
</div>
