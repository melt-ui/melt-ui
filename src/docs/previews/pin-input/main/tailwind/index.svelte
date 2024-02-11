<script lang="ts">
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput({
		defaultValue: ['1', '2', '3', '4', '5'],
	});
</script>

<div use:melt={$root} class="flex items-center gap-2">
	{#each Array.from({ length: 5 }) as _}
		<input
			class="size-12 rounded-md bg-white text-center text-lg text-magnum-900 shadow-sm"
			use:melt={$input()}
		/>
	{/each}
</div>
