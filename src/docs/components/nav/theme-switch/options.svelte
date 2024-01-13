<script lang="ts">
	import { melt } from '$lib/index.js';
	import ThemeIcon from './theme-icon.svelte';
	import { getThemeCtx, themes } from './theme-switch.svelte';

	const {
		elements: { option },
	} = getThemeCtx();
</script>

{#each themes as { value, label }}
	<button
		use:melt={$option({ value, label })}
		class="flex items-center gap-2 rounded-md
		px-2 py-1 text-neutral-400 transition-colors
		data-[highlighted]:bg-neutral-800 data-[highlighted]:text-neutral-300 data-[selected]:!text-white"
	>
		<ThemeIcon theme={value} />
		<span class="text-sm font-semibold">{label}</span>
	</button>
{/each}
