<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { transformAPIString } from '$docs/utils';

	function replaceDoubleQuotes(str: string) {
		return str.replace(/"/g, "'");
	}

	export let data: APISchema['props'];
</script>

{#if data}
	<div class="mb-12 mt-4">
		<div class="-mx-4 overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] border-b border-neutral-700 text-left sm:min-w-full">
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
										<code class="neutral">
											{transformAPIString(prop.type)}
										</code>
									</div>
									{#if prop.description}
										<div class="my-2 leading-7">
											<p>
												{@html transformAPIString(prop.description, true)}
											</p>
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
