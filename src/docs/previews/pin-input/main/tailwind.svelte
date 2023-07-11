<script lang="ts">
	import { createPinInput } from '@melt-ui/svelte';

	const { root, input } = createPinInput();
</script>

<div {...$root} class="flex items-center gap-2">
	{#each Array.from({ length: 6 }) as _, i}
		<input
			class="rounded-md bg-white text-center text-lg text-magnum-900 shadow-sm square-12"
			{...$input}
			use:input
		/>
	{/each}
</div>
