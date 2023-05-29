<script lang="ts" context="module">
	import { createCollapsible } from '$lib/builders';
	import { uniqueContext } from '$lib/internal/helpers';

	export type CollapsibleRootProps = BaseProps & {
		open?: boolean;
		disabled?: boolean;
	};

	type CollapsibleRootContext = ReturnType<typeof createCollapsible>;

	const { getContext, setContext } = uniqueContext<Readable<CollapsibleRootContext>>();
	export const getCollapsibleRootContext = getContext;
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';
	import type { BaseProps } from '$lib/internal/types';
	import { createEventDispatcher } from 'svelte';
	import { writable, type Readable } from 'svelte/store';

	type $$Props = CollapsibleRootProps;
	export let open: $$Props['open'] = false;
	export let disabled: $$Props['disabled'] = false;
	export let use: $$Props['use'] = [];

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();

	const collapsible = writable(null as unknown as CollapsibleRootContext);
	$: $collapsible = createCollapsible({
		open,
		onChange: (v) => {
			open = v;
			dispatch('change', v);
		},
		disabled,
	});

	setContext(collapsible);
</script>

<div {...$$restProps} {...$collapsible.root} use:useActions={use ?? []}>
	<slot />
</div>
