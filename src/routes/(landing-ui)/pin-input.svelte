<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput({
		placeholder: '•',
		value: ['1', '0', '4', '5', ''],
	});

	let className = '';
	export { className as class };
</script>

<div use:melt={$root} class={cn('flex items-center gap-2', className)}>
	{#each Array.from({ length: 5 }) as _}
		<input
			class="size-12 rounded-xl bg-white text-center text-lg text-magnum-900 shadow-sm"
			use:melt={$input()}
		/>
	{/each}
</div>
