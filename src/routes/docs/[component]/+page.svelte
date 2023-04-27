<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';

	import {
		getPropsObj,
		type PreviewDataAttribute,
		type PreviewEvent,
		type PreviewProps,
	} from '$lib/internal/helpers';
	import { schemas } from '$routes/(previews)/schemas.js';
	import { page } from '$app/stores';
	import { cleanupCodeExample } from '$routes/helpers';

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
	function castProps(component?: any) {
		return Object.entries((component.props || {}) as Record<string, PreviewProps>);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castEvents(component?: any) {
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
</script>

<div>
	<div>
		<h1 class="text-3xl font-bold">{cmpSchema.title}</h1>
		<p class="mt-2 text-slate-300">{cmpSchema.description}</p>
	</div>

	<div class="comp-preview mt-4 h-96">
		<div class="flex max-w-md grow items-center justify-center">
			<svelte:component this={cmpSchema.example} bind:propsObj={props} />
		</div>
	</div>

	<div
		class="relative mt-2 overflow-hidden rounded-lg {showCode
			? 'max-h-[auto] overflow-auto'
			: 'max-h-36 overflow-hidden'}"
	>
		<HighlightSvelte code={cleanupCodeExample(cmpSchema.code)} class="bg-zinc-900 text-sm" />
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

	<h2 class="mt-8 text-2xl font-semibold">API Reference</h2>

	{#each Object.entries(cmpSchema.meta) as [subCmp, subCmpSchema]}
		<div
			class="mt-4 grid gap-x-4 gap-y-2 overflow-auto whitespace-nowrap rounded-md bg-zinc-900 p-4 text-white"
		>
			<h2 class="col-span-3 font-bold">{cmpSchema.title}.{subCmp}</h2>

			<span class=" text-sm text-zinc-300">Prop</span>
			<span class=" text-sm text-zinc-300">Type</span>
			<span class=" text-sm text-zinc-300">Control / Value</span>

			<hr class="col-span-3 opacity-25" />

			{#each castProps(subCmpSchema) as [propKey, propDefinition]}
				<span class=" font-mono">{propKey}</span>
				<span class=" font-mono">{propDefinition.type}</span>
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
	{/each}
	<div />
</div>

<style lang="postcss">
	:global(.hljs) {
		background-color: transparent !important;
	}
</style>
