<script lang="ts">
	import {
		getPropsObj,
		type PreviewDataAttribute,
		type PreviewProps
	} from '$routes/(previews)/helpers';

	export let data;

	const cmpSchema = data.schema;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	let props = getPropsObj<{}>(cmpSchema.meta) as any;

	function castPreviewProps(component: { props?: Record<string, PreviewProps> }) {
		return component.props || {};
	}

	function castPreviewDataAttribute(component: {
		props?: unknown;
		dataAttributes?: Record<string, PreviewDataAttribute>;
	}) {
		return component.dataAttributes || {};
	}
</script>

<div class="mx-auto max-w-5xl p-8">
	<div>
		<h2 class="text-xl font-bold">{cmpSchema.title}</h2>
		<p class="text-slate-300">{cmpSchema.description}</p>
	</div>
	<div class="comp-preview mt-4 h-96">
		<div class="mx-auto w-[512px]">
			<svelte:component this={cmpSchema.example} bind:propsObj={props} />
		</div>
	</div>

	{#each Object.entries(cmpSchema.meta) as [subCmp, subCmpProps]}
		<div class="mt-2 grid grid-cols-12 gap-y-2 rounded-md bg-zinc-900 p-4 text-white">
			<h2 class="col-span-12 font-bold">{cmpSchema.title}.{subCmp}</h2>

			<span class="col-span-4 text-sm text-zinc-300">Prop</span>
			<span class="col-span-4 text-sm text-zinc-300">Type</span>
			<span class="col-span-4 text-sm text-zinc-300">Control / Value</span>

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewProps(subCmpProps)) as [propKey, propDefinition]}
				<span class="col-span-4 font-mono">{propKey}</span>
				<span class="col-span-4 font-mono">{propDefinition.type}</span>
				<div class="col-span-4">
					{#if propDefinition.show === null}
						<span class="font-mono text-sm"> N/A </span>
					{:else if propDefinition.show === 'value'}
						<span class="font-mono text-sm">{JSON.stringify(props[subCmp][propKey])}</span>
					{:else if propDefinition.type === 'boolean'}
						<input type="checkbox" bind:checked={props[subCmp][propKey]} />
					{:else if propDefinition.type === 'string'}
						<input
							class="rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
							type="text"
							bind:value={props[subCmp][propKey]}
						/>
					{:else if propDefinition.type === 'number'}
						<input
							class="rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
							type="number"
							bind:value={props[subCmp][propKey]}
						/>
					{:else if propDefinition.type === 'enum'}
						<select
							class="rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
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

			<span class="col-span-4 text-sm text-zinc-300">Data Attribute</span>
			<span class="col-span-4 text-sm text-zinc-300">Value</span>
			<span class="col-span-4 text-sm text-zinc-300">Inspect</span>

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewDataAttribute(subCmpProps)) as [propKey, dataAttributeDefinition]}
				<span class="col-span-4 font-mono">[{propKey}]</span>
				<span class="col-span-4 font-mono">{dataAttributeDefinition.values.join(', ')}</span>
				<!-- How might we dynamically read the data attributes from the example? -->
				<div class="col-span-4" />
			{:else}
				<p class="col-span-12 text-sm">No Data Attributes</p>
			{/each}
		</div>
	{/each}

	<div />
</div>
