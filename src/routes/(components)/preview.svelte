<script lang="ts" context="module">
	export type PreviewProps = {
		// TODO: improve this type
		component: any;
		/** e.g. {tailwind: {index.svelte: ..., tailwind.config.ts: ...}, css: {index.svelte: ...}} */
		code: {
			[codingStyle: string]: {
				[fileName: string]: string;
			} | null;
		};
		fullwidth?: boolean;
	};
</script>

<script lang="ts">
	import { createSelect, type CreateSelectArgs, type SelectOptionArgs } from '$lib';
	import CodeBlock from './code-block.svelte';
	import PreviewWrapper from './preview-wrapper.svelte';
	import Select from './select.svelte';
	import Switch from './switch.svelte';
	import { TabsList, TabsRoot } from './tabs';

	type $$Props = PreviewProps;

	export let component: $$Props['component'];
	export let code: $$Props['code'];
	export let fullwidth: $$Props['fullwidth'] = false;

	let codingStyle = Object.keys(code)[0];
	$: codingStyleObj = code[codingStyle];
	$: files = codingStyleObj !== null ? Object.keys(codingStyleObj) : [];

	const { selected } = createSelect({
		selected: codingStyle,
	});
	selected.subscribe((value) => {
		typeof value === 'string' && (codingStyle = value);
	});

	let viewCode = false;

	$: codeOptions = Object.entries(code).map(([key, value]) => {
		return {
			value: key,
			label: key,
			disabled: value === null,
		} satisfies SelectOptionArgs<string>;
	});
</script>

<div class="mt-4">
	<Switch bind:checked={viewCode} />
</div>

<div class="relative mt-2 rounded-md">
	{#if viewCode}
		<TabsRoot tabs={files} let:tab>
			<div class="flex h-10 items-center">
				{#if files.length > 1}
					<TabsList />
				{/if}
				<div class="ml-auto">
					<Select options={codeOptions} bind:selected={codingStyle} />
				</div>
			</div>
			{#if codingStyleObj}
				<CodeBlock code={codingStyleObj[tab]} />
			{/if}
		</TabsRoot>
	{:else}
		<PreviewWrapper {fullwidth}>
			<svelte:component this={component} />
		</PreviewWrapper>
	{/if}
</div>
