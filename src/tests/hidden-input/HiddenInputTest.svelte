<script lang="ts" context="module">
	export type HiddenInputProps = CreateHiddenInputProps & {
		onChange?: (event: Event) => void;
	};
</script>

<script lang="ts">
	import { melt } from '$lib/index.js';
	import {
		createHiddenInput,
		type CreateHiddenInputProps,
	} from '$lib/builders/hidden-input/index.js';
	import { noop } from '$lib/internal/helpers/callbacks.js';

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
