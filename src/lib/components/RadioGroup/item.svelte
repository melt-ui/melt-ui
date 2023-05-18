<script lang="ts" context="module">
	import { useActions, useCollection } from '$lib/internal/helpers';
	import { reactiveContext, type Defaults } from '$lib/internal/helpers/reactiveContext';
	import type { BaseProps } from '$lib/internal/types';
	import { getRadioGroupItemCollection, getRadioGroupRootContext } from './root.svelte';

	export type RadioGroupItemProps = BaseProps<'button'> & {
		value: string;
		disabled?: boolean;
		required?: boolean;
	};

	type RadioGroupItemContext = {
		readonly checked: boolean;
		readonly disabled?: boolean;
	};

	const defaults = {
		disabled: false,
	} satisfies Defaults<RadioGroupItemContext>;

	const { getContext, setContext } = reactiveContext<RadioGroupItemContext>(defaults);
	export const getRadioGroupItemContext = getContext;
</script>

<script lang="ts">
	type $$Props = RadioGroupItemProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'];
	export let disabled: $$Props['disabled'] = defaults.disabled;
	export let required: $$Props['required'] = false;

	const rootCtx = getRadioGroupRootContext();
	const itemCollection = getRadioGroupItemCollection();
	$: checked = $rootCtx.value === value;

	$: merged = {
		disabled: disabled || $rootCtx.disabled,
		required: required || $rootCtx.required,
	};

	const ctx = setContext();
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

		rootCtx.set({ value });
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
