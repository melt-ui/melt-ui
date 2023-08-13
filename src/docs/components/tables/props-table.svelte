<script lang="ts">
	import type { APISchema } from '$docs/types.js';
	import { transformAPIString } from '$docs/utils/index.js';
	import { APITableHeading } from '$docs/components/index.js';
	import TypeDialog from '../type-dialog.svelte';
	import A from '../markdown/a.svelte';
	function replaceDoubleQuotes(str: string) {
		return str.replace(/"/g, "'");
	}

	export let data: APISchema['props'];
</script>

{#if data}
	<APITableHeading>
		Props
		<svelte:fragment slot="info">
			Props are passed as an object to the function and are used to configure the behavior of the
			builder function or element.
		</svelte:fragment>
	</APITableHeading>

	<div class="mb-4 mt-2">
		<div class="overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-1/4 text-neutral-300">
							<td class="w-[25%] whitespace-nowrap py-2 pl-4 text-sm font-medium sm:pl-0">
								Prop
							</td>
							<td class="w-[25%] whitespace-nowrap py-2 text-sm font-medium">Default</td>
							<td class="w-[50%] whitespace-nowrap py-2 text-sm font-medium">Type / Description</td>
						</tr>
						{#each data as prop}
							<tr>
								<td class="py-3 pl-4 align-baseline sm:pl-0">
									<code>{prop.name}</code>
									{#if prop.required}
										<span class="text-rose-400">*</span>
									{/if}
								</td>
								<td class="py-3 align-baseline text-sm">
									<span>
										{#if prop.default}
											<code class="neutral">
												{replaceDoubleQuotes(prop.default)}
											</code>
										{:else}
											-
										{/if}
									</span>
								</td>
								<td class="py-3 align-baseline text-sm">
									<div class="my-0 space-x-5 whitespace-nowrap">
										{#if prop.longType}
											<TypeDialog
												code={prop.longType.highlightedCode}
												name={transformAPIString(prop.type)}
											/>
										{:else if prop.type}
											<code class="neutral">
												{transformAPIString(prop.type)}
											</code>
										{/if}
									</div>
									{#if prop.description}
										<div class="my-2 leading-7">
											<p>
												{@html transformAPIString(prop.description, true)}
											</p>
											{#if prop.see}
												<p class="italic">
													See <A href={prop.see.href}>{prop.see.label}</A>
												</p>
											{/if}
										</div>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
