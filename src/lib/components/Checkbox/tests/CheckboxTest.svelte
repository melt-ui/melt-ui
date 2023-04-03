<script lang="ts">
	import { Checkbox, type CheckboxRootProps } from '..';

	export let checked: CheckboxRootProps['checked'] = false;
	export let disabled: CheckboxRootProps['disabled'] = false;
</script>

<Checkbox.Root
	aria-label="basic checkbox"
	{checked}
	{disabled}
	name="test-name"
	value="test-value"
	required
>
	<Checkbox.Indicator data-testid={'checkbox-indicator'}>X</Checkbox.Indicator>
</Checkbox.Root>
