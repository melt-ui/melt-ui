<script lang="ts" context="module">
	export type PreviewProps = {
		code: {
			[key: string]: {
				'index.svelte'?: string;
				'tailwind.config.ts'?: string;
				'globals.css'?: string;
			} | null;
		};
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { createSelect, type CreateSelectArgs } from '$lib';
	import { cn } from '$docs/utils';
	import CodeBlock from './code-block.svelte';
	import PreviewWrapper from './preview-wrapper.svelte';
	import { PreviewStyleSelect } from '$docs/components';
	import Switch from './switch.svelte';
	import { TabsList, TabsRoot } from './tabs';

	type $$Props = PreviewProps & {
		viewCode: boolean;
	};

	export let code: $$Props['code'];

	function handleMissingCode(code: $$Props['code']) {
		if (!Object.prototype.hasOwnProperty.call(code, 'tailwind')) {
			code['tailwind'] = null;
		}
		if (!Object.prototype.hasOwnProperty.call(code, 'css')) {
			code['css'] = null;
		}
		return code;
	}

	let codingStyle = Object.keys(handleMissingCode(code))[0]
		? ('tailwind' as const)
		: ('css' as const);

	let codingStyleObj: $$Props['code'][typeof codingStyle] | null =
		handleMissingCode(code)[codingStyle];

	$: {
		codingStyleObj = handleMissingCode(code)[codingStyle];
	}

	$: files = codingStyleObj !== null ? Object.keys(codingStyleObj) : [];

	const { value: localValue } = createSelect({
		value: codingStyle,
	});

	localValue.subscribe((v) => {
		if (v === 'tailwind' || v === 'css') {
			codingStyle = v;
		}
	});
	$: localValue.set(codingStyle);

	let viewCode = false;

	$: codeOptions = Object.entries(handleMissingCode(code)).map(([key, value]) => {
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
	{#if viewCode}
		<div class="flex h-10 items-center md:hidden">
			{#key $page.url.pathname}
				<PreviewStyleSelect options={codeOptions} bind:value={codingStyle} />
			{/key}
		</div>
	{/if}

	<div class="ml-auto">
		<Switch bind:checked={viewCode} />
	</div>
</div>

<div class="relative mt-2 rounded-md">
	{#if viewCode}
		<TabsRoot tabs={files} let:tab>
			<div class="flex h-10 flex-col-reverse gap-4 md:flex-row md:items-center">
				<div class={cn(files.length === 1 && 'lg:hidden')}>
					<TabsList />
				</div>

				<div class="ml-auto hidden md:block">
					{#if codeOptions.length > 1}
						{#key $page.url.pathname}
							<PreviewStyleSelect options={codeOptions} bind:value={codingStyle} />
						{/key}
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
