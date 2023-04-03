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
		open: Writable<boolean>;
		disabled: Readable<boolean>;
	};

	const { getContext, setContext } = uniqueContext<Context>();
	export const getCollapsibleContext = getContext;
</script>

<script lang="ts">
	import { controllableState } from '$lib/helpers/controllableState';
	import { uniqueContext } from '$lib/helpers/uniqueContext';

	import type { BaseProps } from '$lib/types';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	type $$Props = CollapsibleRootProps;
	export let open = false;
	export let disabled = false;

	const writableOpen = controllableState(open, (v) => (open = v));
	$: $writableOpen = open;

	const writableDisabled = writable(disabled);
	$: $writableDisabled = disabled;

	setContext({
		open: writableOpen,
		disabled: derived(writableDisabled, (v) => v)
	});
</script>

<div
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? 'true' : 'false'}
	{...$$restProps}
>
	<slot />
</div>
