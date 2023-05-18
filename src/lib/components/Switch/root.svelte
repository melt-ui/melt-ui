<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';

	export type SwitchRootProps = BaseProps<'button'> & {
		/** The controlled checked state of the switch. */
		checked?: boolean;
		/** When `true`, prevents the user from interacting with the switch. */
		disabled?: boolean;
		/** When `true`, indicates that the user must check the switch before the owning form can be submitted. */
		required?: boolean;
		/** The name of the switch. Submitted with its owning form as part of a name/value pair. */
		name?: string;
		/** The value given as data when submitted with a `name`. */
		value?: string;
	};

	type SwitchRootContext = {
		checked: SwitchRootProps['checked'];
		readonly disabled: SwitchRootProps['disabled'];
	};

	const defaults = {
		checked: false,
		disabled: false,
	} satisfies Defaults<SwitchRootContext>;
	const { getContext, setContext } = reactiveContext<SwitchRootContext>(defaults);
	export const getRootContext = getContext;

	export function getState(checked: boolean | undefined) {
		return checked ? 'checked' : 'unchecked';
	}
</script>

<script lang="ts">
	type $$Props = SwitchRootProps;

	import { useActions } from '$lib/internal/helpers/useActions';
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';

	export let required: $$Props['required'] = false;
	export let value: $$Props['value'] = 'on';

	export let checked: $$Props['checked'] = defaults.checked;
	export let disabled: $$Props['disabled'] = defaults.disabled;

	let button: HTMLButtonElement;
	$: isFormControl = button ? button.closest('form') : true;

	const ctxStore = setContext({ checked: (v) => (checked = v) });
	$: ctxStore.set({ checked, disabled });
</script>

<button
	bind:this={button}
	type="button"
	role="switch"
	aria-checked={checked}
	data-state={getState(checked)}
	data-disabled={disabled ? '' : undefined}
	{value}
	{disabled}
	{...$$restProps}
	use:useActions={$$restProps.use}
	on:click={() => {
		checked = !checked;
	}}
>
	<slot />
</button>

{#if isFormControl}
	<input
		type="checkbox"
		aria-hidden="true"
		hidden
		tabIndex={-1}
		name={$$props.name}
		{value}
		{checked}
		{required}
		{disabled}
		style="
        position: absolute;
        pointer-events: none;
        opacity: 0;
        margin: 0;
        transform: translateX(-100%);
    "
	/>
{/if}
