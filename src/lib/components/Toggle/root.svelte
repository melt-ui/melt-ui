<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers/useActions';
	import type { BaseProps, Detailed } from '$lib/internal/types';
	import { createEventDispatcher } from 'svelte';

	export type ToggleRootProps = BaseProps<'button'> & {
		/** The controlled pressed state of the toggle. */
		pressed?: boolean;
		/** When true, prevents the user from interacting with the toggle. */
		disabled?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = ToggleRootProps;

	export let pressed: $$Props['pressed'] = false;
	export let disabled: $$Props['disabled'] = false;

	type $$Events = {
		change: CustomEvent<boolean>;
	};
	const dispatch = createEventDispatcher<Detailed<$$Events>>();
	export let use: $$Props['use'] = [];
</script>

<button
	{disabled}
	on:click={() => {
		pressed = !pressed;
		dispatch('change', pressed);
	}}
	data-state={pressed ? 'on' : 'off'}
	data-disabled={disabled || undefined}
	use:useActions={use ?? []}
	{...$$restProps}
>
	<slot />
</button>
