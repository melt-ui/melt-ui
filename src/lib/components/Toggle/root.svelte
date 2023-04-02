<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';

	export type ToggleProps = BaseProps<HTMLButtonElement> & {
		/** The controlled pressed state of the toggle. */
		pressed?: boolean;
		/** When true, prevents the user from interacting with the toggle. */
		disabled?: boolean;
		/** The pressed state of the toggle when it is initially rendered.
		 *  Use when you do not need to control its pressed state. */
		defaultPressed?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = ToggleProps;

	export let defaultPressed: $$Props['defaultPressed'] = undefined;
	export let pressed: $$Props['pressed'] = defaultPressed ?? false;
	export let disabled: $$Props['disabled'] = false;
</script>

<button
	{disabled}
	on:click={() => (pressed = !pressed)}
	data-state={pressed ? 'on' : 'off'}
	data-disabled={disabled || undefined}
	{...$$restProps}
>
	<slot />
</button>
