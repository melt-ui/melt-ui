<script lang="ts" context="module">
	type SvelteFile = `${string}.svelte`;
	function isSvelteFile(fileName: string): fileName is SvelteFile {
		return fileName.endsWith('.svelte');
	}

	type StyleFile = 'tailwind.config.ts' | 'globals.css';

	type CodeEntry = {
		[fileName: `${string}.svelte`]:
			| {
					pp: string;
					base: string;
			  }
			| undefined;
		'globals.css'?: string;
		'tailwind.config.ts'?: string;
	};

	type ProcessedCodeEntry = {
		[key: string]: string | undefined;
	};

	export type PreviewProps = {
		code: {
			[codingStyle: string]: CodeEntry | null;
		};
	};
</script>

<script lang="ts">
	import { PreviewStyleSelect } from '$docs/components';
	import { cn } from '$docs/utils';
	import type { SelectOptionProps } from '$lib';
	import { isBrowser } from '$lib/internal/helpers';
	import { getUsingPreprocessor } from '$routes/store';
	import { writable } from 'svelte/store';
	import CodeBlock from './code-block.svelte';
	import PreviewWrapper from './preview-wrapper.svelte';
	import Switch from './switch.svelte';
	import { TabsList, TabsRoot } from './tabs';

	type $$Props = PreviewProps & {
		viewCode: boolean;
	};

	export let code: $$Props['code'];

	const usingPreprocessor = getUsingPreprocessor();

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

		const processedCode = {} as ProcessedCodeEntry;

		for (const key in code[codingStyle]) {
			if (isSvelteFile(key)) {
				processedCode[key] = usePP ? code[codingStyle]?.[key]?.pp : code[codingStyle]?.[key]?.base;
			} else {
				processedCode[key] = code[codingStyle]?.[key as StyleFile];
			}
		}

		return processedCode;
	}

	type CodingStyle = 'tailwind' | 'css';
	function isCodingStyle(value: unknown): value is CodingStyle {
		return typeof value === 'string' && ['tailwind', 'css'].includes(value);
	}

	const codingStyle = (function initCodingStyle() {
		const defaultWritable = writable<CodingStyle>('tailwind' in code ? 'tailwind' : 'css');
		if (!isBrowser) return defaultWritable;
		const preferredStyle = localStorage.getItem('melt-coding-style') as CodingStyle | null;
		if (isCodingStyle(preferredStyle)) {
			return writable<CodingStyle>(preferredStyle);
		}
		return writable<CodingStyle>('tailwind' in code ? 'tailwind' : 'css');
	})();

	codingStyle.subscribe((value) => {
		if (!isBrowser) return;
		localStorage.setItem('melt-coding-style', value);
	});

	const resetCodingStyle = () => {
		if (!isBrowser) return;
		const styles = Object.keys(code).filter((k) => !!code[k]);
		const preferredStyle = localStorage.getItem('melt-coding-style') as CodingStyle | null;

		if (isCodingStyle(preferredStyle) && styles.includes(preferredStyle)) {
			codingStyle.set(preferredStyle);
		} else {
			codingStyle.set(styles[0] as CodingStyle);
			// Keep the coding style in local storage up to date
			if (isCodingStyle(preferredStyle)) {
				localStorage.setItem('melt-coding-style', preferredStyle);
			}
		}
	};

	$: {
		code;
		resetCodingStyle();
	}

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
			value: key as 'tailwind' | 'css',
			label: key,
			disabled: value === null,
		} satisfies SelectOptionProps;
	});

	const fileList = ['index.svelte', 'tailwind.config.ts', 'globals.css'] as const;

	export function isFileName(key: string): key is (typeof fileList)[number] {
		return fileList.includes(key as (typeof fileList)[number]);
	}
</script>

<div class="mt-4 flex flex-row items-center justify-between">
	{#if viewCode}
		<div class="flex h-10 items-center">
			<PreviewStyleSelect options={codeOptions} {codingStyle} />
		</div>
	{/if}

	<div class="ml-auto">
		<Switch bind:checked={viewCode}>View code</Switch>
	</div>
</div>

<div class="relative mt-2 rounded-md">
	{#if viewCode}
		<TabsRoot tabs={files} let:tab>
			<div class="flex flex-col-reverse gap-4">
				<div class={cn('overflow-x-auto', files.length === 1 && 'lg:hidden')}>
					<TabsList />
				</div>
			</div>
			{#key $codingStyle}
				{#if codingStyleObj && codingStyleObj[tab]}
					<CodeBlock>
						{@html codingStyleObj[tab]}
					</CodeBlock>
				{/if}
			{/key}
		</TabsRoot>
	{:else}
		<PreviewWrapper>
			<slot />
		</PreviewWrapper>
	{/if}
</div>
