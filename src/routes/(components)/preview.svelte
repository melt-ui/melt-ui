<script lang="ts" context="module">
	export type PreviewProps = {
		// TODO: improve this type
		component: any;
		/** e.g. {tailwind: {index.svelte: ..., tailwind.config.ts: ...}, css: {index.svelte: ...}} */
		code: {
			[codingStyle: string]: {
				[fileName: string]: string;
			};
		};
		fullwidth?: boolean;
	};
</script>

<script lang="ts">
	import { createSelect } from '$lib';
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
	$: files = Object.keys(code[codingStyle]);

	const { selected } = createSelect({
		selected: codingStyle,
	});
	selected.subscribe((value) => {
		typeof value === 'string' && (codingStyle = value);
	});

	let viewCode = false;
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
					<Select options={Object.keys(code)} bind:selected={codingStyle} />
				</div>
			</div>

			<CodeBlock code={code[codingStyle][tab]} />
		</TabsRoot>
	{:else}
		<PreviewWrapper {fullwidth}>
			<svelte:component this={component} />
		</PreviewWrapper>
	{/if}
</div>
