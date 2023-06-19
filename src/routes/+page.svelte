<script lang="ts">
	import { fly } from 'svelte/transition';
	import ArrowRight from '~icons/lucide/arrow-right';
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';

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

{#each { length: 6 } as _, n}
	<div class="cumulative-gradient" style:--n={n + 1} />
{/each}

<div class="relative grid grow place-items-center p-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-full flex flex-col gap-4 py-24">
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
						<div in:fly|local={{ y: -4 }}>
							<Check class="inline-block h-5 w-5 text-magnum-500 transition" />
						</div>
					{:else}
						<div in:fly|local={{ y: 4 }}>
							<Copy class="inline-block h-5 w-5 transition" />
						</div>
					{/if}
				</button>
				<a
					href="/docs"
					class="mt-4 flex items-center justify-between gap-4 rounded bg-magnum-600 px-4 py-3
					font-sans font-semibold text-white transition hover:bg-magnum-700 active:translate-y-0.5 active:bg-magnum-700 sm:shrink"
				>
					Read the docs
					<ArrowRight class="inline-block h-5 w-5 text-white" />
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.logo {
		aspect-ratio: 340/109;
		width: 340px;
		max-width: 100%;
	}
</style>
