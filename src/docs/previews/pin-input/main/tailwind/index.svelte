<script lang="ts">
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
		states: { value },
	} = createPinInput();
</script>

<button on:click={() => value.set('12345'.split(''))}> Set to 12345 </button>
{$value}
<div use:melt={$root} class="flex items-center gap-2">
	{#each Array.from({ length: 5 }) as _, i}
		<input
			class="rounded-md bg-white text-center text-lg text-magnum-900 shadow-sm square-12"
			use:melt={$input()}
		/>
	{/each}
</div>
