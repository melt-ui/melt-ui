<script lang="ts">
	import { createHiddenInput } from '$lib/builders/hidden-input/index.js';
	import { melt } from '$lib/index.js';
	import { noop } from '$lib/internal/helpers/callbacks.js';
	import type { HiddenInputProps } from './HiddenInput.js';

	type $$Props = HiddenInputProps;
	export let name: $$Props['name'] = undefined;
	export let value: $$Props['value'];
	export let disabled: $$Props['disabled'] = undefined;
	export let required: $$Props['required'] = undefined;
	export let onChange: $$Props['onChange'] = noop;

	const hiddenInput = createHiddenInput({
		name,
		value,
		disabled,
		required,
	});
</script>

<input use:melt={$hiddenInput} on:change={onChange} data-testid="input" />
