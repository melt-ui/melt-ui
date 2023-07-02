<script lang="ts">
	import type { APISchema } from './api.svelte';
	import Description from './description.svelte';
	import H3 from './h3.svelte';
	import H4 from './h4.svelte';
	import P from './p.svelte';

	export let schema: APISchema;
	function parseDescription(content: string | string[] | undefined) {
		if (content === undefined) {
			return '-';
		}

		if (Array.isArray(content)) {
			return `<code class="neutral"> ${content.join(' | ').replaceAll('"', "'")}</code>`;
		}

		// replace `$1` with <code>$1</code>
		return content.replace(/`([^`]+)`/g, `<code class="neutral">$1</code>`);
	}

	function parseCode(content: string | string[] | undefined) {
		if (content === undefined) {
			return '-';
		}
		if (Array.isArray(content)) {
			return `<code class="neutral">${content.join(' | ').replaceAll('"', "'")}</code>`;
		} else {
			return `<code class="neutral"> ${content.replaceAll('"', "'")}</code>`;
		}
	}

	$: empty =
		!schema.args &&
		!schema.props &&
		!schema.events &&
		!schema.dataAttributes &&
		!schema.keyboardInteractions;

	$: htmlDescription = parseDescription(schema.description);
</script>

<div class="mb-10 flex flex-col gap-2">
	<div class="px-4 sm:px-0">
		<H3 class="mt-6">
			<code class="text-lg">
				{schema.title}
			</code>
		</H3>
		<Description class="text-lg text-neutral-400">{@html htmlDescription}</Description>
	</div>
	<div class="flex flex-col gap-4">
		{#if schema.args}
			{#each schema.args as arg}
				<div class="mb-6 flex flex-col gap-4">
					<div class="flex flex-col gap-2 px-4 sm:px-0">
						<code class="not-filled w-fit text-sm font-medium">{arg.label}</code>
						<P class="text-neutral-400">
							{@html parseDescription(arg.description ?? '')}
						</P>
					</div>
					<div class="border-b border-t border-white/10">
						<dl class="divide-y divide-white/10">
							<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-white">Type</dt>
								<dd class="mt-1 text-sm leading-6 text-neutral-400 sm:col-span-2 sm:mt-0">
									{@html parseCode(arg.type ?? '')}
								</dd>
							</div>
							<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-white">Default</dt>
								<dd class="mt-1 text-sm leading-6 text-neutral-400 sm:col-span-2 sm:mt-0">
									{@html parseCode(arg.default ?? '-')}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			{/each}
		{/if}
		{#if schema.dataAttributes}
			<div class="flex-col-gap-2 mb-2 flex">
				<H4 class="mt-0">Data Attributes</H4>
			</div>
			<div class="border-b border-t border-white/10">
				<dl class="divide-y divide-white/10">
					{#each schema.dataAttributes as attr}
						<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-white">
								{@html parseCode(attr.label)}
							</dt>
							<dd class="mt-1 text-sm leading-6 text-neutral-400 sm:col-span-2 sm:mt-0">
								{@html parseDescription(attr.value)}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}
	</div>
</div>
