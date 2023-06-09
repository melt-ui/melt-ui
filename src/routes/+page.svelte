<script lang="ts">
	import { getPropsObj } from '$lib/internal/helpers';

	import Copy from '~icons/lucide/copy';
	import Check from '~icons/lucide/check';
	import ArrowRight from '~icons/lucide/arrow-right';
	import { fly } from 'svelte/transition';

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyInstallCommand() {
		navigator.clipboard.writeText(`npm install melt-ui`);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

{#each { length: 6 } as _, n}
	<div class="cumulative-gradient" style:--n={n + 1} />
{/each}

<div class="relative grid grow place-items-center p-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-full flex flex-col gap-4 py-24">
			<div class="flex flex-col items-center">
				<img src="/logo.svg" alt="Melt UI" />
				<button
					on:click={copyInstallCommand}
					class="text-md group mt-8 flex items-center justify-between gap-4 break-keep rounded
					 bg-zinc-800 px-4 py-3 text-left font-mono transition hover:bg-zinc-800/75 active:translate-y-0.5 sm:shrink"
					aria-label="Copy install command"
				>
					<span>npm install <span class="whitespace-nowrap">@melt-ui/svelte</span></span>
					{#if copied}
						<div in:fly|local={{ y: -4 }}>
							<Check class="inline-block h-5 w-5 text-casablanca-500 transition" />
						</div>
					{:else}
						<div in:fly|local={{ y: 4 }}>
							<Copy class="inline-block h-5 w-5 transition" />
						</div>
					{/if}
				</button>
				<a
					href="/docs/components/collapsible"
					class="mt-4 flex items-center justify-between gap-4 rounded bg-casablanca-600 px-4 py-3
					font-sans text-lg font-semibold text-white transition hover:bg-casablanca-700 active:translate-y-0.5 active:bg-casablanca-700 sm:shrink"
				>
					Read the docs
					<ArrowRight class="inline-block h-5 w-5 text-white" />
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.cumulative-gradient {
		--size: calc(var(--n) * 20rem);

		position: absolute;
		top: 32px;
		left: 40px;
		width: var(--size);
		height: var(--size);
		border-radius: 100%;
		z-index: -1;

		translate: calc(var(--size) / -2) calc(var(--size) / -2);

		background: linear-gradient(
			180deg,
			theme('colors.casablanca.600/0.25'),
			theme('colors.casablanca.800/0.25')
		);

		opacity: 0.25;

		display: none;
	}
</style>
