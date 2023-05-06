<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';

	import {
		getPropsObj,
		type PreviewDataAttribute,
		type PreviewEvent,
		type PreviewMeta,
		type PreviewProps,
		type PreviewSchema,
	} from '$lib/internal/helpers';
	import { schemas } from '$routes/(previews)/schemas.js';
	import { page } from '$app/stores';
	import { cleanupCodeExample } from '$routes/helpers';
	import Copy from '~icons/lucide/copy';
	import Check from '~icons/lucide/check';
	import { fly } from 'svelte/transition';

	export let data;

	let cmpSchema = schemas[data.cmp as keyof typeof schemas];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	let props = getPropsObj<{}>(cmpSchema.meta) as any;

	function reset(cmp: string) {
		cmpSchema = schemas[cmp as keyof typeof schemas];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
		props = getPropsObj<{}>(cmpSchema.meta) as any;
	}

	$: reset(data.cmp);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const castSchema = cmpSchema as PreviewSchema<any>;

	function castMeta(component: any) {
		return Object.entries((component.meta || {}) as PreviewMeta<any>);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castProps(component: any) {
		return Object.entries((component.props || {}) as Record<string, PreviewProps>);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castEvents(component: any) {
		return Object.entries((component.events || {}) as Record<string, PreviewEvent<unknown>>);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castDataAttrs(component: any) {
		return Object.entries((component.dataAttributes || {}) as Record<string, PreviewDataAttribute>);
	}

	let showCode = false;
	$: {
		$page.url.pathname;
		showCode = false;
	}

	$: cleanedUpCode = cleanupCodeExample(cmpSchema.code, castSchema);

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyCode() {
		navigator.clipboard.writeText(cleanedUpCode);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}

	function getDescriptionHtml(description: string) {
		// Replace all text inside *text* with <code>text</code>
		return description.replace(/\*(.*?)\*/g, '<code>$1</code>');
	}
</script>

<h1 class="text-3xl font-bold">{cmpSchema.title}</h1>
<p class="mt-1 text-xl font-thin text-zinc-400">{cmpSchema.description}</p>

<div class="comp-preview comp-preview-colored mt-8 h-96">
	<div class="flex max-w-md grow items-center justify-center">
		<svelte:component this={cmpSchema.example} bind:propsObj={props} />
	</div>
</div>

<div
	class="relative mt-2 overflow-hidden rounded-lg {showCode
		? 'max-h-[auto] overflow-auto'
		: 'max-h-36 overflow-hidden'}"
>
	<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode}>
		{#if copied}
			<div in:fly={{ y: -4 }}>
				<Check class="text-vermilion-500" />
			</div>
		{:else}
			<div in:fly={{ y: 4 }}>
				<Copy class="hover:text-vermilion-500" />
			</div>
		{/if}
	</button>
	<HighlightSvelte code={cleanedUpCode} class="bg-zinc-900 text-sm" />
	<div
		class="absolute bg-gradient-to-t from-zinc-900/90 to-vermilion-900/30 {showCode
			? 'inset-x-0 bottom-0'
			: 'inset-0'}"
	>
		<div class="absolute inset-x-0 bottom-3 flex justify-center">
			<button
				class="rounded-lg border border-vermilion-600/20 bg-zinc-900 px-4 py-1 text-sm hover:border-vermilion-600/70"
				on:click={() => (showCode = !showCode)}
			>
				{showCode ? 'Collapse code' : 'Expand code'}
			</button>
		</div>
	</div>
</div>

<h2 class="mt-12 text-3xl font-semibold">API Reference</h2>

<div class="mt-8 flex flex-col gap-8">
	{#each castMeta(cmpSchema) as [subCmp, subCmpSchema]}
		<div>
			<h2 class="col-span-3 text-xl font-bold">{subCmp}</h2>
			{#if subCmpSchema.description}
				<p class="col-span-3 text-lg font-thin text-zinc-400">
					{@html getDescriptionHtml(subCmpSchema.description)}
				</p>
			{/if}

			<div
				class="mt-4 grid gap-x-4 gap-y-2 overflow-auto whitespace-nowrap rounded-md bg-zinc-900 p-4 text-white"
			>
				<span class=" text-sm text-zinc-300">Prop</span>
				<span class=" text-sm text-zinc-300">Type</span>
				<span class=" text-sm text-zinc-300">Control / Value</span>

				<hr class="col-span-3 opacity-25" />

				{#each castProps(subCmpSchema) as [propKey, propDefinition]}
					<div>
						<code class="font-mono">{propKey}</code>
					</div>
					<span class="font-mono">{propDefinition.type}</span>
					<div class="">
						{#if propDefinition.show === null}
							<span class="white w-full font-mono text-sm"> N/A </span>
						{:else if propDefinition.show === 'value'}
							<span class="white w-full font-mono text-sm"
								>{JSON.stringify(props[subCmp][propKey])}</span
							>
						{:else if propDefinition.type === 'boolean'}
							<input type="checkbox" bind:checked={props[subCmp][propKey]} />
						{:else if propDefinition.type === 'string'}
							<input
								class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
								type="text"
								bind:value={props[subCmp][propKey]}
							/>
						{:else if propDefinition.type === 'number'}
							<input
								class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
								type="number"
								bind:value={props[subCmp][propKey]}
							/>
						{:else if propDefinition.type === 'enum'}
							<select
								class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
								bind:value={props[subCmp][propKey]}
							>
								<option value="" hidden />
								{#each propDefinition.options as value}
									<option {value}>{value}</option>
								{/each}
							</select>
						{:else}
							{props[subCmp][propKey]}
						{/if}
					</div>
				{:else}
					<p class="col-span-3 text-sm">No props</p>
				{/each}

				<!-- Events -->
				{#if castEvents(subCmpSchema).length}
					<hr class="col-span-3 h-4 opacity-0" />

					<span class=" text-sm text-zinc-300">Event</span>
					<span class=" text-sm text-zinc-300">Payload</span>
					<span class=" text-sm text-zinc-300" />

					<hr class="col-span-3 opacity-25" />

					{#each castEvents(subCmpSchema) as [eventKey, eventDef]}
						<span class=" font-mono">{eventKey}</span>
						<span class=" font-mono">
							{Array.isArray(eventDef.payload)
								? eventDef.payload.join(' | ')
								: JSON.stringify(eventDef.payload)}
						</span>
						<div class="" />
					{/each}
				{/if}

				<!-- Data Attributes -->
				{#if castDataAttrs(subCmpSchema).length}
					<hr class="col-span-3 h-4 opacity-0" />

					<span class=" text-sm text-zinc-300">Data Attribute</span>
					<span class=" text-sm text-zinc-300">Value</span>
					<span class=" text-sm text-zinc-300">Inspect</span>

					<hr class="col-span-3 opacity-25" />

					{#each castDataAttrs(subCmpSchema) as [attrKey, attrDef]}
						<span class="font-mono">[{attrKey}]</span>
						<span class="font-mono">
							{Array.isArray(attrDef.values) ? attrDef.values.join(' | ') : attrDef.values}
						</span>
						<!-- How might we dynamically read the data attributes from the example? -->
						<div class="" />
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>

<div />

<style lang="postcss">
	:global(.hljs) {
		background-color: transparent !important;
	}

	:global(code) {
		background-color: theme('colors.vermilion.900/0.5');
		color: theme('colors.vermilion.300');
		padding-inline: theme('spacing.1');
		border-radius: theme('borderRadius.sm');
	}
</style>
