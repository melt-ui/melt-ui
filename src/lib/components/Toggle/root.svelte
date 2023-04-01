<script lang="ts" context="module">
	import { controllableState } from '$lib/helpers/controllableState';
	import type { BaseProps } from '$lib/types';

	export type ToggleProps = BaseProps & {
		pressed?: boolean;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = ToggleProps;

	export let pressed: $$Props['pressed'] = false;
	export let disabled: $$Props['disabled'] = false;
</script>

<button
	{disabled}
	data-state={pressed ? 'on' : 'off'}
	on:click={() => (pressed = !pressed)}
	data-disabled={disabled || undefined}
	{...$$restProps}
>
	<slot />
</button>
