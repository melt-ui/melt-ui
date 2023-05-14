<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';

	import { page } from '$app/stores';
	import type {
		PreviewDataAttribute,
		PreviewEvent,
		PreviewMeta,
		PreviewProps,
	} from '$lib/internal/helpers';

	import { cleanupCodeExample } from '$routes/helpers';
	import { fly } from 'svelte/transition';
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import Table from './Table.svelte';
	import TableWrapper from './TableWrapper.svelte';
	import { schemas } from '$routes/(previews)/schemas';

	export let data;
	$: cmpSchema = schemas[data.cmp as keyof typeof schemas];
	$: props = data.props;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	$: castSchema = cmpSchema as any;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function castMeta(component: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function hasPropsOrEventsOrDataAttrs(component: any) {
		return (
			Object.keys(component.props || {}).length > 0 ||
			Object.keys(component.events || {}).length > 0 ||
			Object.keys(component.dataAttributes || {}).length > 0
		);
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
		<svelte:component this={castSchema.example} bind:propsObj={props} />
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
		<div class="flex w-full flex-col">
			<h2 class="text-xl font-bold">{subCmp}</h2>
			{#if subCmpSchema.description}
				<p class="text-lg font-thin text-zinc-400">
					{@html getDescriptionHtml(subCmpSchema.description)}
				</p>
			{/if}

			{#if !hasPropsOrEventsOrDataAttrs(subCmpSchema)}
				<p class="text-lg font-thin text-zinc-400">
					No props, events or data attributes are explicitly required.
				</p>
			{:else}
				<TableWrapper>
					<Table
						head={['Prop', 'Type', 'Control / Value']}
						headMobile="Props"
						data={castProps(subCmpSchema)}
					>
						<div class="contents" slot="row" let:datum={[key, definition]}>
							<div>
								<code class="font-mono">{key}</code>
							</div>
							<span class="font-mono">{definition.typeLabel ?? definition.type}</span>
							<div>
								{#if definition.show === null}
									<span class="white w-full font-mono text-sm"> N/A </span>
								{:else if definition.show === 'value'}
									<span class="white w-full font-mono text-sm"
										>{JSON.stringify(props[subCmp][key])}</span
									>
								{:else if definition.type === 'boolean'}
									<input type="checkbox" bind:checked={props[subCmp][key]} />
								{:else if definition.type === 'string'}
									<input
										class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
										type="text"
										bind:value={props[subCmp][key]}
									/>
								{:else if definition.type === 'number'}
									<input
										class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
										type="number"
										bind:value={props[subCmp][key]}
									/>
								{:else if definition.type === 'enum'}
									<select
										class="w-full rounded-sm border border-zinc-400 bg-zinc-950 px-2 py-1 text-white"
										bind:value={props[subCmp][key]}
									>
										<option value="" hidden />
										{#each definition.options as value}
											<option {value}>{value}</option>
										{/each}
									</select>
								{:else}
									{props[subCmp][key]}
								{/if}
							</div>
						</div>
						<p slot="empty">No Props</p>
					</Table>

					<!-- Events -->
					{#if castEvents(subCmpSchema).length}
						<hr class="col-span-3 h-4 opacity-0" />

						<Table head={['Event', 'Payload']} headMobile="Events" data={castEvents(subCmpSchema)}>
							<div class="contents" slot="row" let:datum={[key, definition]}>
								<div>
									<code class="font-mono">{key}</code>
								</div>
								<span class="font-mono">
									{Array.isArray(definition.payload)
										? definition.payload.join(' | ')
										: JSON.stringify(definition.payload)}
								</span>
								<div class="" />
							</div>
							<p slot="empty">No Events</p>
						</Table>
					{/if}

					<!-- Data Attributes -->
					{#if castDataAttrs(subCmpSchema).length}
						<hr class="col-span-3 h-4 opacity-0" />

						<Table
							head={['Data Attribute', 'Value']}
							headMobile="Data Attributes"
							data={castDataAttrs(subCmpSchema)}
						>
							<div class="contents" slot="row" let:datum={[key, definition]}>
								<div>
									<code class="font-mono">{key}</code>
								</div>
								<span class="font-mono">
									{Array.isArray(definition.values)
										? definition.values.join(' | ')
										: definition.values}
								</span>
								<div class="" />
							</div>
							<p slot="empty">No Data Attributes</p>
						</Table>
					{/if}
				</TableWrapper>
			{/if}
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
