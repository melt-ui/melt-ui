<script lang="ts">
	import { createPinInput, melt, type CreatePinInputProps } from '$lib/index.js';

	export let placeholder: CreatePinInputProps['placeholder'] = '○';
	export let name: CreatePinInputProps['name'] = undefined;
	export let disabled: CreatePinInputProps['disabled'] = false;
	export let type: CreatePinInputProps['type'] = 'text';
	export let value: CreatePinInputProps['value'] = ['1', '2', '3', '4', '5'];

	const {
		elements: { root, input, hiddenInput },
	} = createPinInput({
		placeholder,
		name,
		disabled,
		type,
		value,
	});
</script>

<main>
	<div use:melt={$root} data-testid="root">
		{#each Array(5) as _, i}
			<input use:melt={$input()} data-testid="input-{i + 1}" />
		{/each}
		<input use:melt={$hiddenInput} data-testid="hidden-input" />
	</div>
</main>
