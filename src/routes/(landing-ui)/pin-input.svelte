<script lang="ts">
	import { cn } from '$docs/utils';
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput({
		placeholder: '•',
		defaultValue: ['1', '0', '4', '5', ''],
	});

	let className = '';
	export { className as class };
</script>

<div use:melt={$root} class={cn('flex items-center gap-2', className)}>
	{#each Array.from({ length: 5 }) as _, i}
		<input
			class="rounded-xl bg-white text-center text-lg text-magnum-900 shadow-sm square-12"
			use:melt={$input()}
		/>
	{/each}
</div>
