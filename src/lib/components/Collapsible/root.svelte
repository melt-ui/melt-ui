<script lang="ts" context="module">
	export type CollapsibleRootProps = BaseProps & {
		/**
		 * The controlled open state of the collapsible.
		 */
		open?: boolean;
		/**
		 * When `true`, prevents the user from interacting with the collapsible.
		 */
		disabled?: boolean;
	};

	export type Context = {
		open: boolean;
		disabled: boolean;
	};

	const { getContext, setContext } = reactiveContext<Context>();
	export const getRootContext = getContext;
</script>

<script lang="ts">
	import { reactiveContext } from '$lib/helpers/reactiveContext';

	import type { BaseProps } from '$lib/types';

	type $$Props = CollapsibleRootProps;
	export let open = false;
	export let disabled = false;

	const contextStore = setContext({
		open: [open, (v) => (open = v)],
		disabled: [disabled, (v) => (disabled = v)]
	});
	$: contextStore.set({ open, disabled });
</script>

<div
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? 'true' : 'false'}
	{...$$restProps}
	data-radix-collapsible-root
>
	<slot />
</div>
