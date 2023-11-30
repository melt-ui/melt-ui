<script lang="ts">
	import { createToggleGroup, melt } from '$lib';
	import { userPrefersMode } from 'mode-watcher';
	import ThemeIcon from './theme-icon.svelte';
	import type { Theme } from './types';

	export let onChange: () => void;

	const {
		elements: { root, item },
		helpers: { isPressed },
	} = createToggleGroup({
		orientation: 'vertical',
		defaultValue: $userPrefersMode,
		loop: false,
		onValueChange: ({ curr, next }) => {
			const definedNext = (next || curr) as Theme;
			$userPrefersMode = definedNext;
			onChange();
			return definedNext;
		},
	});

	const themes: { id: Theme; label: string }[] = [
		{ id: 'dark', label: 'Dark' },
		{ id: 'light', label: 'Light' },
		{ id: 'system', label: 'System' },
	];
</script>

<div use:melt={$root} class="flex flex-col gap-2" aria-label="Theme choice">
	{#each themes as { id, label }}
		<button
			use:melt={$item(id)}
			aria-labelledby="{id}-label"
			class="flex items-center gap-2 transition-colors {$isPressed(id)
				? 'text-white'
				: 'text-neutral-400 hover:text-neutral-300'}"
		>
			<ThemeIcon theme={id} />
			<span class="text-sm font-semibold">{label}</span>
		</button>
	{/each}
</div>
