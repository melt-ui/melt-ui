<script lang="ts">
	import { createPinInput } from '@melt-ui/svelte';

	const {
		elements: { root, input },
	} = createPinInput();
</script>

<div melt={$root} class="flex items-center gap-2">
	{#each Array.from({ length: 6 }) as _, i}
		<input
			class="rounded-md bg-white text-center text-lg text-magnum-900 shadow-sm square-12"
			melt={$input}
		/>
	{/each}
</div>
