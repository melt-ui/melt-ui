<script lang="ts">
	import { createSwitch, melt, type CreateSwitchProps } from '$lib/index.js';

	export let checked: CreateSwitchProps['checked'] = undefined;
	export let defaultChecked: CreateSwitchProps['defaultChecked'] = undefined;
	export let disabled: CreateSwitchProps['disabled'] = undefined;
	export let name: CreateSwitchProps['name'] = undefined;
	export let onCheckedChange: CreateSwitchProps['onCheckedChange'] = undefined;
	export let required: CreateSwitchProps['required'] = undefined;
	export let value: CreateSwitchProps['value'] = undefined;

	const {
		elements: { root, input },
	} = createSwitch({
		checked,
		defaultChecked,
		disabled,
		name,
		onCheckedChange,
		required,
		value,
	});
</script>

<main>
	<form>
		<label id="switch-label" for="switch" data-testid="label"> Airplane mode </label>
		<button use:melt={$root} id="switch" aria-labelledby="switch-label" data-testid="switch" />
		<input use:melt={$input} data-testid="input" />
	</form>
</main>
