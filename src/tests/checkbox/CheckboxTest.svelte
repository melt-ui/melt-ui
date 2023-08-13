<script lang="ts">
	import { createCheckbox, type CreateCheckboxProps, melt } from '$lib/index.js';

	export let defaultChecked: CreateCheckboxProps['defaultChecked'] = 'indeterminate';

	const {
		elements: { root },
		helpers: { isChecked },
	} = createCheckbox({
		defaultChecked,
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
