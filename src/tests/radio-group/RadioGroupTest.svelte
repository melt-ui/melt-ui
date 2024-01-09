<script lang="ts">
	import { createRadioGroup, melt, type CreateRadioGroupProps } from '$lib/index.js';
	import { removeUndefined } from '../utils.js';

	type $$Props = CreateRadioGroupProps & {
		items?: Item[];
	};

	type Item = {
		value: string;
		disabled: boolean;
	};

	export let value: CreateRadioGroupProps['value'] = undefined;
	export let defaultValue: CreateRadioGroupProps['defaultValue'] = undefined;
	export let disabled: CreateRadioGroupProps['disabled'] = undefined;
	export let onValueChange: CreateRadioGroupProps['onValueChange'] = undefined;
	export let required: CreateRadioGroupProps['required'] = undefined;
	export let items: Item[] = [
		{ value: 'a', disabled: false },
		{ value: 'b', disabled: false },
		{ value: 'c', disabled: false },
		{ value: 'd', disabled: false },
	];

	const {
		elements: { root, item },
		states: { value: localValue },
	} = createRadioGroup({
		value,
		defaultValue,
		onValueChange,
		disabled,
		required,
		...removeUndefined($$restProps),
	});
</script>

<main>
	<div data-testid="value">{$localValue}</div>
	<form>
		<label id="radio-group-label" for="radio-group" data-testid="label"> Airplane mode </label>
		<div use:melt={$root} data-testid="root">
			{#each items as radioItem}
				<button use:melt={$item(radioItem)} data-testid={radioItem.value}>{radioItem.value}</button>
			{/each}
		</div>
	</form>
</main>
