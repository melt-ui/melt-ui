<script lang="ts" context="module">
	export type PreviewProps = {
		code: {
			[key: string]: {
				'index.svelte'?: string;
				'tailwind.config.ts'?: string;
				'globals.css'?: string;
			};
		};
		fullwidth?: boolean;
	};
</script>

<script lang="ts">
	import { createSelect, type CreateSelectArgs } from '$lib';
	import { cn } from '$routes/helpers';
	import CodeBlock from './code-block.svelte';
	import PreviewWrapper from './preview-wrapper.svelte';
	import Select from './select.svelte';
	import Switch from './switch.svelte';
	import { TabsList, TabsRoot } from './tabs';

	type $$Props = PreviewProps & {
		viewCode: boolean;
	};

	export let code: $$Props['code'];

	let codingStyle = Object.keys(code)[0] ? ('tailwind' as const) : ('css' as const);
	let codingStyleObj: $$Props['code'][typeof codingStyle] | null = code[codingStyle];

	$: {
		codingStyleObj = code[codingStyle];
	}

	$: files = codingStyleObj !== null ? Object.keys(codingStyleObj) : [];

	const { value } = createSelect({
		value: codingStyle,
	});
	value.subscribe((v) => {
		if (v === 'tailwind' || v === 'css') {
			codingStyle = v;
		}
	});

	export let viewCode = false;

	$: codeOptions = Object.entries(code).map(([key, value]) => {
		return {
			value: key,
			label: key,
			disabled: value === null,
		} satisfies CreateSelectArgs;
	});

	const fileList = ['index.svelte', 'tailwind.config.ts', 'globals.css'] as const;

	export function isFileName(key: string): key is (typeof fileList)[number] {
		return fileList.includes(key as (typeof fileList)[number]);
	}
</script>

<div class="mt-4 flex flex-row items-center justify-between">
	<div class="flex h-10 items-center lg:hidden">
		{#if viewCode}
			<Select options={codeOptions} bind:value={codingStyle} />
		{/if}
	</div>

	<div class="ml-auto">
		<Switch bind:checked={viewCode} />
	</div>
</div>

<div class="relative mt-2 rounded-md">
	{#if viewCode}
		<TabsRoot tabs={files} let:tab>
			<div class="flex h-10 flex-col-reverse gap-4 lg:flex-row lg:items-center">
				<div class={cn(files.length === 1 && 'lg:hidden')}>
					<TabsList />
				</div>

				<div class="ml-auto hidden lg:block">
					{#if codeOptions.length > 1}
						<Select options={codeOptions} bind:value={codingStyle} />
					{/if}
				</div>
			</div>
			{#if isFileName(tab)}
				{#if codingStyleObj && codingStyleObj[tab]}
					<CodeBlock>
						{@html codingStyleObj[tab]}
					</CodeBlock>
				{/if}
			{/if}
		</TabsRoot>
	{:else}
		<PreviewWrapper>
			<slot />
		</PreviewWrapper>
	{/if}
</div>
