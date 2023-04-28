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
	function copyInstallCommand() {
		navigator.clipboard.writeText(`npm install radix-svelte`);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<div class="relative grid grow place-items-center p-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-full flex flex-col gap-4 py-24">
			<h1 class="text-4xl font-bold text-white lg:text-5xl">Don’t reinvent the wheel.</h1>
			<p class="text-lg text-white lg:text-xl">
				<span class="opacity-75"
					>Radix Svelte is an unofficial community-led Svelte port of
				</span><a
					href="https://radix-ui.com/"
					target="_blank"
					class="max-w-prose underline decoration-white/50 underline-offset-4 opacity-75 active:translate-y-px hocus:decoration-vermilion-500 hocus:opacity-100"
					>Radix UI Primitives</a
				><span class="opacity-75"
					>, a set of unstyled, accessible components for building high‑quality design systems and
					web apps.</span
				>
			</p>
			<div class="flex flex-col gap-4 sm:flex-row">
				<a
					href="/docs/accordion"
					class="text-md flex justify-between gap-4 rounded bg-vermilion-600 p-4 font-sans font-semibold text-white transition active:translate-y-0.5 active:bg-vermilion-800 sm:shrink"
				>
					Read the docs
					<ArrowRight class="inline-block h-5 w-5 text-white" />
				</a>
				<button
					on:click={copyInstallCommand}
					class="text-md group flex justify-between gap-4 rounded bg-zinc-800 p-4 font-mono text-white transition active:translate-y-0.5 active:bg-zinc-900 sm:shrink"
					><span>npm install radix-svelte</span>
					{#if copied}
						<Check class="inline-block h-5 w-5 text-vermilion-500" />
					{:else}
						<Copy class="inline-block h-5 w-5 group-hover:text-vermilion-500" />
					{/if}
				</button>
			</div>
		</div>
		{#each sortedSchemas as [identifier, schema], idx}
			{@const propsObj = getPropsObjForSchema(schema)}
			<div
				class="group flex min-h-[256px] w-full flex-col gap-2 overflow-hidden transition lg:h-[512px] lg:max-w-[512px]"
			>
				<a href={`/docs/${identifier}`} class="flex items-baseline justify-between">
					<h2 class="text-xl font-normal capitalize text-white">{schema.title}</h2>
					<span
						class="text-md text-white underline decoration-white/50 underline-offset-4 opacity-75 active:opacity-75 group-focus-within:decoration-vermilion-500 group-focus-within:opacity-100 hocus:decoration-vermilion-500 hocus:opacity-100"
						>View docs</span
					></a
				>
				<div class="comp-preview grow place-items-center">
					<svelte:component this={schema.example} {propsObj} />
				</div>
			</div>
		{/each}
	</div>
</div>
