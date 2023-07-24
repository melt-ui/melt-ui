<script lang="ts">
	import { createCheckbox, type CreateCheckboxProps } from '..';

	export let defaultChecked: CreateCheckboxProps['defaultChecked'] = 'indeterminate';

	const {
		elements: { root },
		helpers: { isChecked },
	} = createCheckbox({
		defaultChecked,
	});
</script>

<main>
	<button melt={$root} data-testid="checkbox">
		{#if $isChecked}
			checked
		{:else}
			not-checked
		{/if}
	</button>
</main>
