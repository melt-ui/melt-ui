<script lang="ts">
	import { createCheckbox, type CreateCheckboxProps, melt } from '$lib/index.js';

	export let checked: CreateCheckboxProps['checked'] = 'indeterminate';

	const {
		elements: { root },
		helpers: { isChecked },
	} = createCheckbox({
		checked,
	});
</script>

<main>
	<button use:melt={$root} data-testid="checkbox">
		{#if $isChecked}
			checked
		{:else}
			not-checked
		{/if}
	</button>
</main>
