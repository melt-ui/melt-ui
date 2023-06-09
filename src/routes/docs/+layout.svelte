<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { isMenuOpen } from '$routes/+layout.svelte';
	import { cn } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/tomorrow-night';
	import Sidebar from './sidebar.svelte';

	afterNavigate(() => {
		$isMenuOpen = false;
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<div class="flex max-w-full flex-col gap-8 xl:flex-row xl:px-6">
	<div
		class={cn(
			'z-10 flex-shrink-0 flex-grow basis-[min(20vw,250px)] xl:w-auto xl:max-w-xs',
			$isMenuOpen ? 'block' : 'hidden xl:block'
		)}
	>
		<Sidebar />
	</div>
	<div
		class={cn(
			`flex-shrink flex-grow justify-center overflow-y-auto`,
			$isMenuOpen ? 'hidden xl:flex' : 'flex'
		)}
	>
		<div class="w-full max-w-7xl items-center px-4 py-8">
			<div class="w-full">
				<slot />
			</div>
		</div>
	</div>
	<div class="flex-shrink-0 flex-grow basis-[min(20vw,250px)]" />
</div>
