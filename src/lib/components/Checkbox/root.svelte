<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import type { BaseProps } from '$lib/types';

	export type CheckboxRootProps = BaseProps<HTMLButtonElement> & {
		/** The controlled checked state of the checkbox. */
		checked?: CheckedState;
		/** When `true`, prevents the user from interacting with the checkbox. */
		disabled?: boolean;
		/** When `true`, indicates that the user must check the checkbox before the owning form can be submitted. */
		required?: boolean;
		/** The name of the checkbox. Submitted with its owning form as part of a name/value pair. */
		name?: string;
		/** The value given as data when submitted with a `name`. */
		value?: string;

		readonly 'data-state'?: 'checked' | 'unchecked' | 'indeterminate';
		readonly 'data-disabled'?: boolean;
	};

	type CheckedState = boolean | 'indeterminate';

	type CheckboxContext = {
		readonly checked: CheckedState;
		readonly disabled: boolean;
	};

	const { getContext, setContext } = reactiveContext<CheckboxContext>();
	export const getRootContext = getContext;

	export function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
		return checked === 'indeterminate';
	}

	export function getState(checked: CheckedState) {
		return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked';
	}
</script>

<script lang="ts">
	type $$Props = CheckboxRootProps;

	export let checked: CheckedState = false;
	export let disabled = false;
	export let required: $$Props['required'] = false;
	export let name: $$Props['name'] = '';
	export let value: $$Props['value'] = '';

	const ctxStore = setContext({
		checked: [checked],
		disabled: [disabled]
	});
	$: ctxStore.set({ checked, disabled });
</script>

<button
	on:click|stopPropagation={() => {
		if (isIndeterminate(checked)) {
			checked = true;
		} else {
			checked = !checked;
		}
	}}
	on:keydown={(event) => {
		// According to WAI ARIA, Checkboxes don't activate on enter keypress
		if (event.key === 'Enter') event.preventDefault();
	}}
	type="button"
	role="checkbox"
	aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
	aria-required={required}
	data-state={getState(checked)}
	data-disabled={disabled ? '' : undefined}
	{disabled}
	{value}
	{...$$restProps}
>
	<slot />

	<!-- Hidden input to bubble value up to form -->
	<input
		type="checkbox"
		aria-hidden="true"
		hidden
		tabIndex={-1}
		{name}
		{value}
		checked={isIndeterminate(checked) ? false : checked}
		{required}
		{disabled}
		style:position="absolute"
		style:pointer-events="none"
		style:opacity="0"
		style:margin="0"
		style:transform="translateX(-100%)"
	/>
</button>
