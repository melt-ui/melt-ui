<script lang="ts" context="module">
	type Props = BaseProps & {
		open?: boolean;
		defaultOpen?: boolean;
		disabled?: boolean;
	};

	export type Context = {
		open: Writable<boolean>;
		disabled: Readable<boolean>;
	};

	const key = Symbol();

	export function getCollapsibleContext() {
		return getContext<Context>(key);
	}
</script>

<script lang="ts">
	import { controllableState } from '$lib/helpers/controllableState';

	import type { BaseProps } from '$lib/types';
	import { getContext, setContext } from 'svelte';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	type $$Props = Props;

	export let open = false;
	export let defaultOpen = false;
	export let disabled = false;

	const writableOpen = controllableState(open || defaultOpen, (v) => (open = v));
	$: $writableOpen = open || defaultOpen;

	const writableDisabled = writable(disabled);
	$: $writableDisabled = disabled;

	setContext<Context>(key, {
		open: writableOpen,
		disabled: derived(writableDisabled, (v) => v)
	});
</script>

<div
	{...$$restProps}
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? 'true' : 'false'}
>
	{open}
	<slot />
</div>
