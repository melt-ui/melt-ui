<script lang="ts">
	import { getPropsObj } from '$lib/internal/helpers';
	import { schemas } from './(previews)/schemas';

	import Copy from '~icons/lucide/copy';
	import Check from '~icons/lucide/check';
	import ArrowRight from '~icons/lucide/arrow-right';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getPropsObjForSchema(schema: (typeof schemas)[keyof typeof schemas]): any {
		// eslint-disable-next-line @typescript-eslint/ban-types
		return getPropsObj<{}>(schema.meta);
	}

	$: sortedSchemas = Object.entries(schemas).sort((a, b) => {
		return a[1].title.toLowerCase().localeCompare(b[1].title.toLowerCase());
	});

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyInstallCommand() {
		navigator.clipboard.writeText(`npm install radix-svelte`);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<div class="relative grid grow place-items-center p-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-full flex flex-col gap-4 py-24">
			<h1 class="text-4xl font-bold text-white lg:text-5xl">Don’t reinvent the wheel.</h1>
			<p class="max-w-prose text-lg text-white lg:text-xl">
				<span class="opacity-75"
					>Radix Svelte is an unofficial community-led Svelte port of
				</span><a href="https://radix-ui.com/" target="_blank" class="link">Radix UI Primitives</a
				><span class="opacity-75"
					>, a set of unstyled, accessible components for building high‑quality design systems and
					web apps.</span
				>
			</p>
			<div class="flex flex-col gap-4 sm:flex-row">
				<a
					href="/docs/accordion"
					class="text-md flex justify-between gap-4 rounded bg-vermilion-600 p-4 font-sans font-semibold text-white transition hover:bg-vermilion-500 active:translate-y-0.5 active:bg-vermilion-800 sm:shrink"
				>
					Read the docs
					<ArrowRight class="inline-block h-5 w-5 text-white" />
				</a>
				<button
					on:click={copyInstallCommand}
					class="text-md group flex justify-between gap-4 rounded bg-zinc-800 p-4 font-mono text-white transition hover:bg-zinc-700 active:translate-y-0.5 active:bg-zinc-900 sm:shrink"
					aria-label="Copy install command"
					><span>npm install radix-svelte</span>
					{#if copied}
						<Check class="inline-block h-5 w-5 text-vermilion-500 transition" />
					{:else}
						<Copy class="inline-block h-5 w-5 transition" />
					{/if}
				</button>
			</div>
		</div>
		{#each sortedSchemas as [identifier, schema], idx}
			{@const propsObj = getPropsObjForSchema(schema)}
			<div
				class="flex min-h-[256px] w-full flex-col gap-2 overflow-hidden transition lg:h-[400px] lg:w-[400px]"
			>
				<a href={`/docs/${identifier}`} class="group flex items-baseline justify-between">
					<h2 class="text-xl font-normal capitalize text-white">{schema.title}</h2>
					<span class="link">View docs</span></a
				>
				<div class="comp-preview grow place-items-center">
					<svelte:component this={schema.example} {propsObj} />
				</div>
			</div>
		{/each}
	</div>
</div>
