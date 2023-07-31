<script lang="ts">
	import { createCommandCenter, melt } from '$lib';

	const {
		elements: { search, trigger, content, overlay },
		helpers: { commandCenterKeyDownHandler, registerCommands },
		states: { commands, searchValue },
	} = createCommandCenter();

	$: $registerCommands([
		{
			label: 'Test',
			callback() {
				alert('Hello world!');
			},
		},
	]);
</script>

<svelte:window on:keydown={$commandCenterKeyDownHandler} />

<button use:melt={$trigger}>Hey-oh</button>

<div
	class="fixed left-0 top-0 h-screen w-full bg-black/50"
	use:melt={$overlay}
/>
<div
	class="fixed left-[50%] top-[50%] z-30 max-h-[85vh] w-[90vw]
	max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
	p-6 text-black shadow-lg"
	use:melt={$content}
>
	<input use:melt={$search} />
	{$searchValue}
	<div class="flex flex-col gap-2">
		{#each $commands as command}
			<button on:click={command.callback}>{command.label}</button>
		{/each}
	</div>
</div>
