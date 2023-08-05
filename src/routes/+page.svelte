<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ArrowRight, Check, Copy } from 'lucide-svelte';
	import { Button } from '$docs/components';

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyInstallCommand() {
		navigator.clipboard.writeText(`npm install @melt-ui/svelte`);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<svelte:head>
	<title>Melt UI</title>
</svelte:head>

<div class="relative grid grow place-items-center">
	<div class="flex flex-col items-center">
		<img class="logo" src="/logo.svg" alt="Melt UI" />
		<button
			on:click={copyInstallCommand}
			class="text-md group mt-8 flex items-center justify-between gap-4 break-keep rounded
					 bg-zinc-800 px-4 py-3 text-left font-mono transition hover:bg-zinc-800/75 active:translate-y-0.5 sm:shrink"
			aria-label="Copy install command"
		>
			<span>npm install <span class="whitespace-nowrap">@melt-ui/svelte</span></span>
			{#if copied}
				<div in:fly={{ y: -4 }}>
					<Check class="inline-block text-magnum-500 transition square-4" />
				</div>
			{:else}
				<div in:fly={{ y: 4 }}>
					<Copy class="inline-block transition square-4" />
				</div>
			{/if}
		</button>
		<Button href="/docs" class="mt-4 gap-2 sm:shrink">
			Read the docs
			<ArrowRight class="inline-block square-4 " />
		</Button>
	</div>
</div>

<style lang="postcss">
	.logo {
		aspect-ratio: 340/109;
		width: 340px;
		max-width: 100%;
	}
</style>
