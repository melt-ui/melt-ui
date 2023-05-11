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
		<div class="flex w-full flex-col">
			<h2 class="col-span-3 text-xl font-bold">{subCmp}</h2>
			{#if subCmpSchema.description}
				<p class="col-span-3 text-lg font-thin text-zinc-400">
					{@html getDescriptionHtml(subCmpSchema.description)}
				</p>
			{/if}

			{#if !hasPropsOrEventsOrDataAttrs(subCmpSchema)}
				<p class="col-span-3 text-lg font-thin text-zinc-400">
					No props, events or data attributes are explicitly required.
				</p>
			{:else}
				<div
					class="mt-4 flex grid-cols-1 flex-col gap-4 overflow-auto whitespace-nowrap rounded-md bg-zinc-900 p-4 text-white"
				>
					{#if castProps(subCmpSchema).length}
						<div class="grid grid-cols-5 gap-x-4 gap-y-2">
							<span class="col-span-1 hidden truncate text-sm text-zinc-300 lg:block">Prop</span>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block">Type</span>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block"
								>Control/Value</span
							>
							<span class="text-md col-span-full truncate text-zinc-300 lg:hidden">Props</span>

							<hr class="col-span-5 opacity-25" />

							<div class="col-span-5 divide-y divide-white divide-opacity-5 lg:divide-opacity-0">
								{#each castProps(subCmpSchema) as [propKey, propDefinition]}
									<div
										class="col-span-5 flex flex-col gap-x-4 gap-y-2 py-3 lg:grid lg:grid-cols-5 lg:py-1"
									>
										<code class="col-span-1 max-w-fit truncate font-mono">{propKey}</code>
										<span class="col-span-2 truncate font-mono"
											>{propDefinition.typeLabel ?? propDefinition.type}</span
										>
										<div class="col-span-2">
											{#if propDefinition.show === null}
												<span class="white w-full truncate font-mono text-sm"> N/A </span>
											{:else if propDefinition.show === 'value'}
												<span class="white w-full truncate font-mono text-sm"
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
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Events -->

					{#if castEvents(subCmpSchema).length}
						<div class="grid grid-cols-5 gap-x-4 gap-y-2">
							<span class="col-span-1 hidden truncate text-sm text-zinc-300 lg:block">Event</span>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block">Payload</span>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block" />
							<span class="text-md block truncate text-zinc-300 lg:hidden">Events</span>

							<hr class="col-span-5 opacity-25" />

							<div class="col-span-5 divide-y divide-white divide-opacity-5 lg:divide-opacity-0">
								{#each castEvents(subCmpSchema) as [eventKey, eventDef]}
									<div
										class="col-span-5 flex flex-col gap-x-4 gap-y-2 py-3 lg:grid lg:grid-cols-5 lg:py-1"
									>
										<code class="col-span-1 col-start-1 max-w-fit truncate font-mono lg:max-w-none"
											>{eventKey}</code
										>

										<span class="col-span-2 truncate font-mono">
											{Array.isArray(eventDef.payload)
												? eventDef.payload.join(' | ')
												: JSON.stringify(eventDef.payload)}
										</span>
										<!-- <div class="col-span-2" /> -->
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Data Attributes -->

					{#if castDataAttrs(subCmpSchema).length}
						<div class="grid grid-cols-5 gap-x-4 gap-y-2">
							<span class="col-span-1 hidden truncate text-sm text-zinc-300 lg:block"
								>Data Attribute</span
							>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block">Value</span>
							<span class="col-span-2 hidden truncate text-sm text-zinc-300 lg:block">Inspect</span>
							<span class="text-md col-span-full block truncate text-zinc-300 lg:hidden"
								>Data Attributes</span
							>

							<hr class="col-span-5 opacity-25" />

							<div class="col-span-5 divide-y divide-white divide-opacity-5 lg:divide-opacity-0">
								{#each castDataAttrs(subCmpSchema) as [attrKey, attrDef]}
									<div
										class="col-span-5 flex flex-col gap-x-4 gap-y-2 py-3 lg:grid lg:grid-cols-5 lg:py-1"
									>
										<span class="col-span-1 col-start-1 truncate font-mono">[{attrKey}]</span>
										<span class="col-span-2 truncate font-mono">
											{Array.isArray(attrDef.values) ? attrDef.values.join(' | ') : attrDef.values}
										</span>
										<!-- How might we dynamically read the data attributes from the example? -->
										<!-- <div class="col-span-2" /> -->
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
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
