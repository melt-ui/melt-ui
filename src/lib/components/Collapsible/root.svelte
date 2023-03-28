<script lang="ts" context="module">
	type Props = BaseProps & {
		open?: boolean;
		defaultOpen?: boolean;
		disabled?: boolean;
	};

	export type Context = {
		open: Readable<boolean>;
		setOpen: (value: boolean) => void;
		disabled: boolean;
	};

	const key = Symbol();

	export function getCollapsibleContext() {
		return getContext<Context>(key);
	}
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getContext, setContext } from 'svelte';
	import { derived, writable, type Readable } from 'svelte/store';

	type $$Props = Props;

	export let open = false;
	export let defaultOpen = false;
	export let disabled = false;

	const writableOpen = writable(open || defaultOpen);
	$: $writableOpen = open || defaultOpen;

	setContext<Context>(key, {
		open: derived(writableOpen, (v) => v),
		setOpen: (value) => (open = value),
		disabled
	});
</script>

<div {...$$restProps}>
	Inner open: {open}
	<slot />
</div>
