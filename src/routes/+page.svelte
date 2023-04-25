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
			<p class="text-lg text-white opacity-75 lg:text-xl">
				Unstyled, accessible components for building high‑quality design systems and web apps, now
				in Svelte.
			</p>
			<div class="flex flex-row gap-4">
				<a
					href="/docs/accordion"
					class="text-md rounded bg-vermilion-600 p-4 font-sans font-semibold text-white transition hover:bg-vermilion-800 active:translate-y-0.5"
				>
					Read the docs
					<ArrowRight class="inline-block w-5 h-5 ml-2 text-white" />
				</a>
				<button
					on:click={copyInstallCommand}
					class="group text-md rounded bg-zinc-900 p-4 font-mono text-white transition hover:bg-zinc-800 active:translate-y-0.5"
					><span>npm install radix-svelte</span>
					{#if copied}
						<Check class="inline-block w-5 h-5 ml-2 text-vermilion-500" />
					{:else}
						<Copy class="inline-block w-5 h-5 ml-2 group-hover:text-vermilion-500" />
					{/if}
				</button>
			</div>
		</div>
		{#each sortedSchemas as [identifier, schema], idx}
			{@const propsObj = getPropsObjForSchema(schema)}
			<div
				class="flex min-h-[256px] w-full flex-col gap-2 overflow-hidden transition lg:h-[512px] lg:max-w-[512px]"
			>
				<a href={`/docs/${identifier}`} class="flex items-baseline justify-between">
					<h2 class="text-xl font-normal capitalize text-white">{schema.title}</h2>
					<span
						class="text-md text-white underline-offset-2 opacity-75 hover:underline hover:opacity-100 focus:underline active:opacity-75"
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
