<script lang="ts">
	import {
		getPropsObj,
		type PreviewPropBoolean,
		type PreviewPropEnum,
		type PreviewPropNumber,
		type PreviewPropString
	} from '$routes/(previews)/helpers';

	export let data;

	const cmpSchema = data.schema;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	let props = getPropsObj<{}>(cmpSchema.props) as any;

	function castPreviewProps(
		component: Record<
			string,
			PreviewPropBoolean | PreviewPropNumber | PreviewPropString | PreviewPropEnum<string>
		>
	) {
		return component;
	}
</script>

<div class="mx-auto max-w-5xl p-8">
	<h2 class="text-xl font-bold">{cmpSchema.title}</h2>
	<p class="text-slate-300">{cmpSchema.description}</p>
	<div class="preview mt-4 h-96">
		<div class="mx-auto max-w-[600px]">
			<svelte:component this={cmpSchema.example} bind:propsObj={props} />
		</div>
	</div>

	{#each Object.entries(cmpSchema.props) as [subCmp, subCmpProps]}
		<div class="mt-4 grid grid-cols-12 gap-y-2 rounded-md bg-zinc-900 p-4 text-white">
			<h2 class="col-span-12 font-bold">{cmpSchema.title}.{subCmp}</h2>

			<span class="col-span-4 text-sm text-zinc-300">Prop</span>
			<span class="col-span-4 text-sm text-zinc-300">Type</span>
			<span class="col-span-4 text-sm text-zinc-300">Control</span>

			<hr class="col-span-12 opacity-25" />

			{#each Object.entries(castPreviewProps(subCmpProps)) as [propKey, propDefinition]}
				<span class="col-span-4 font-mono">{propKey}</span>
				<span class="col-span-4 font-mono">{propDefinition.type}</span>
				<div class="col-span-4">
					{#if propDefinition.hideControls}
						<span class="font-mono text-sm"> N/A </span>
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
							{#each propDefinition.values as value}
								<option {value}>{value}</option>
							{/each}
						</select>
					{/if}
				</div>
			{:else}
				<p class="col-span-12 text-sm">No props</p>
			{/each}
		</div>
	{/each}

	<div />
</div>

<style lang="postcss">
	.preview {
		background-image: linear-gradient(
			330deg,
			theme('colors.purple.500') 0%,
			theme('colors.indigo.800') 100%
		);

		border-radius: theme('borderRadius.lg');

		padding: theme('spacing.8');

		@media screen('md') {
			padding: theme('spacing.16');
		}
	}
</style>
