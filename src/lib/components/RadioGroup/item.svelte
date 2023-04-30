<script lang="ts" context="module">
	import { reactiveContext, useActions, useCollection } from '$lib/internal/helpers';
	import type { BaseProps, Defaults } from '$lib/internal/types';
	import { getRadioGroupItemCollection, getRadioGroupRootContext } from './root.svelte';

	export type RadioGroupItemProps = BaseProps<'button'> & {
		value: string;
		disabled?: boolean;
		required?: boolean;
	};

	const defaults: Defaults<RadioGroupItemProps> = {
		disabled: false,
		required: false,
	};

	type RadioGroupItemContext = {
		readonly checked: boolean;
		readonly disabled?: boolean;
	};

	const { getContext, setContext } = reactiveContext<RadioGroupItemContext>();
	export const getRadioGroupItemContext = getContext;
</script>

<script lang="ts">
	type $$Props = RadioGroupItemProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'];
	export let disabled: $$Props['disabled'] = defaults.disabled;
	export let required: $$Props['required'] = defaults.required;

	const rootCtx = getRadioGroupRootContext();
	const itemCollection = getRadioGroupItemCollection();
	$: checked = $rootCtx.value === value;

	$: merged = {
		disabled: disabled || $rootCtx.disabled,
		required: required || $rootCtx.required,
	};

	const ctx = setContext({ checked: [checked], disabled: [merged?.disabled] });
	$: ctx.set({ checked, disabled: merged.disabled });
</script>

<button
	type="button"
	role="radio"
	aria-checked={checked}
	data-state={checked ? 'checked' : 'unchecked'}
	data-disabled={merged.disabled ? '' : undefined}
	disabled={merged.disabled}
	{value}
	on:click={() => {
		if ($rootCtx.disabled) {
			return;
		}
		$rootCtx.value = value;
	}}
	{...$$restProps}
	use:useActions={[
		...(use ?? []),
		[
			useCollection,
			{
				collection: itemCollection,
			},
		],
	]}
>
	<slot />
</button>
<input
	type="hidden"
	aria-hidden
	tabIndex={-1}
	name={$rootCtx.name}
	{value}
	{checked}
	required={merged.required}
	disabled={merged.disabled}
/>
