<script lang="ts" context="module">
	type CodeEntry = {
		'index.svelte'?: {
			pp: string;
			base: string;
		};
		'tailwind.config.ts'?: string;
		'globals.css'?: string;
	};

	type ProcessedCodeEntry = Omit<CodeEntry, 'index.svelte'> & {
		'index.svelte'?: string;
	};

	export type PreviewProps = {
		code: {
			[codingStyle: string]: CodeEntry | null;
		};
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$docs/utils';
	import CodeBlock from './code-block.svelte';
	import PreviewWrapper from './preview-wrapper.svelte';
	import { PreviewStyleSelect } from '$docs/components';
	import Switch from './switch.svelte';
	import { TabsList, TabsRoot } from './tabs';
	import { writable } from 'svelte/store';
	import { usingPreprocessor } from '$routes/store';

	type $$Props = PreviewProps & {
		viewCode: boolean;
	};

	export let code: $$Props['code'];

	function normalizeCode(code: $$Props['code']) {
		if (!Object.prototype.hasOwnProperty.call(code, 'tailwind')) {
			code['tailwind'] = null;
		}
		if (!Object.prototype.hasOwnProperty.call(code, 'css')) {
			code['css'] = null;
		}

		return code;
	}

	type ProcessCodeArgs = {
		code: $$Props['code'];
		codingStyle: string;
		usePP?: boolean;
	};
	function processCode({ code, codingStyle, usePP }: ProcessCodeArgs): ProcessedCodeEntry {
		code = normalizeCode(code);

		const svelteFileObj = code[codingStyle]?.['index.svelte'];

		const processedCode: ProcessedCodeEntry = {
			...code[codingStyle],
			['index.svelte']:
				svelteFileObj !== undefined ? (usePP ? svelteFileObj.pp : svelteFileObj.base) : undefined,
		};

		return processedCode;
	}

	const codingStyle = writable<'tailwind' | 'css'>('tailwind');

	let codingStyleObj: ProcessedCodeEntry | null = processCode({
		code,
		codingStyle: $codingStyle,
		usePP: $usingPreprocessor,
	});

	$: {
		codingStyleObj = processCode({
			code,
			codingStyle: $codingStyle,
			usePP: $usingPreprocessor,
		});
	}

	$: files = codingStyleObj !== null ? Object.keys(codingStyleObj) : [];

	export let viewCode = false;

	$: codeOptions = Object.entries(normalizeCode(code)).map(([key, value]) => {
		return {
			value: key,
			label: key,
			disabled: value === null,
		};
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
				<PreviewStyleSelect options={codeOptions} {codingStyle} />
			{/key}
		</div>
	{/if}

	<div class="ml-auto">
		<Switch bind:checked={viewCode}>View code</Switch>
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
							<PreviewStyleSelect options={codeOptions} {codingStyle} />
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
