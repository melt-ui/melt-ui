<script lang="ts">
	import {
		getPropsObj,
		type PreviewDataAttribute,
		type PreviewEvent,
		type PreviewProps,
	} from '$routes/(previews)/helpers';
	import { schemas } from '$routes/(previews)/schemas.js';

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
	function castPreviewProps(component?: any) {
		return (component.props || {}) as Record<string, PreviewProps>;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castPreviewEvents(component?: any) {
		return (component.events || {}) as Record<string, PreviewEvent<unknown>>;
	}

	function castPreviewDataAttributes(component: {
		props?: unknown;
		dataAttributes?: Record<string, PreviewDataAttribute>;
	}) {
		return component.dataAttributes || {};
	}
</script>

<div>
	<div>
		<h2 class="text-xl font-bold">{cmpSchema.title}</h2>
		<p class="text-slate-300">{cmpSchema.description}</p>
	</div>
	<div class="comp-preview mt-4 h-96">
		<div class="flex max-w-md grow items-center justify-center">
			<svelte:component this={cmpSchema.example} bind:propsObj={props} />
		</div>
	</div>

	{#each Object.entries(cmpSchema.meta) as [subCmp, subCmpSchema]}
		<div
			class="mt-2 grid grid-cols-12 gap-y-2 gap-x-2 rounded-md bg-zinc-900 p-4 text-white overflow-auto"
		>
			<h2 class="col-span-12 font-bold">{cmpSchema.title}.{subCmp}</h2>

			<span class="col-span-4 text-sm text-zinc-300">Prop</span>
			<span class="col-span-4 text-sm text-zinc-300">Type</span>
			<span class="col-span-4 text-sm text-zinc-300">Control / Value</span>

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewProps(subCmpSchema)) as [propKey, propDefinition]}
				<span class="col-span-4 font-mono">{propKey}</span>
				<span class="col-span-4 font-mono">{propDefinition.type}</span>
				<div class="col-span-4">
					{#if propDefinition.show === null}
						<span class="w-full font-mono text-sm white"> N/A </span>
					{:else if propDefinition.show === 'value'}
						<span class="w-full font-mono text-sm white"
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
				<p class="col-span-12 text-sm">No props</p>
			{/each}

			<hr class="col-span-12 h-4 opacity-0" />

			<!-- Events -->
			<span class="col-span-4 text-sm text-zinc-300">Event</span>
			<span class="col-span-4 text-sm text-zinc-300">Payload</span>
			<span class="col-span-4 text-sm text-zinc-300" />

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewEvents(subCmpSchema)) as [eventKey, eventDef]}
				<span class="col-span-4 font-mono">{eventKey}</span>
				<span class="col-span-4 font-mono">
					{Array.isArray(eventDef.payload)
						? eventDef.payload.join(' | ')
						: JSON.stringify(eventDef.payload)}
				</span>
				<div class="col-span-4" />
			{/each}

			<hr class="col-span-12 h-4 opacity-0" />

			<span class="col-span-4 text-sm text-zinc-300">Data Attribute</span>
			<span class="col-span-4 text-sm text-zinc-300">Value</span>
			<span class="col-span-4 text-sm text-zinc-300">Inspect</span>

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewDataAttributes(subCmpSchema)) as [attrKey, attrDef]}
				<span class="col-span-4 font-mono">[{attrKey}]</span>
				<span class="col-span-4 font-mono">{attrDef.values.join(', ')}</span>
				<!-- How might we dynamically read the data attributes from the example? -->
				<div class="col-span-4" />
			{:else}
				<p class="col-span-12 text-sm">No Data Attributes</p>
			{/each}
		</div>
	{/each}
	<div />
</div>
