<script lang="ts">
	import { createCheckbox, type CreateCheckboxProps } from '..';

	export let checked: CreateCheckboxProps['checked'] = 'indeterminate';

	const { root, isChecked } = createCheckbox({
		checked,
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
