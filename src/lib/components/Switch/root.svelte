<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { uniqueContext } from '$lib/helpers/uniqueContext';

	export type SwitchRootProps = BaseProps<HTMLButtonElement> & {
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

	type SwitchContext = {
		checked: Writable<SwitchRootProps['checked']>;
		disabled: Readable<SwitchRootProps['disabled']>;
	};

	const { getContext, setContext } = uniqueContext<SwitchContext>();
	export const getSwitchContext = getContext;

	export function getState(checked: boolean | undefined) {
		return checked ? 'checked' : 'unchecked';
	}
</script>

<script lang="ts">
	type $$Props = SwitchRootProps;

	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { controllableState } from '$lib/helpers/controllableState';

	export let required: $$Props['required'] = false;
	export let value: $$Props['value'] = 'on';

	export let checked: $$Props['checked'];
	const writableChecked = controllableState(checked, (v) => (checked = v));
	$: $writableChecked = checked;

	export let disabled: $$Props['disabled'] = false;
	const writableDisabled = writable(disabled);
	$: if (typeof disabled !== 'undefined') $writableDisabled = disabled;

	let button: HTMLButtonElement;
	$: isFormControl = button ? button.closest('form') : true;

	setContext({
		checked: writableChecked,
		disabled: derived(writableDisabled, (v) => v)
	});
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
	on:click={() => {
		checked = !checked;
	}}
>
	<slot />
</button>

{#if isFormControl}
	{$$props.name}
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
