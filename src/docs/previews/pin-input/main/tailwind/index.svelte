<script lang="ts">
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput();
</script>

<div use:melt={$root} class="flex items-center gap-2">
	{#each Array.from({ length: 5 }) as _, i}
		<input
			class="rounded-md bg-white text-center text-lg text-magnum-900 shadow-sm square-12"
			use:melt={$input()}
		/>
	{/each}
</div>
