<script lang="ts">
	import type { APISchema } from '$docs/types.js';
	import { transformAPIString } from '$docs/utils/index.js';
	import { APITableHeading, InfoPopover } from '$docs/components/index.js';

	export let data: APISchema['returnedProps'];
	export let title = 'Returns';
	export let tableHeading = 'Returned Prop';
</script>

{#if data}
	<APITableHeading>
		{title}
		<svelte:fragment slot="info">
			<slot name="info">
				Builder functions return an object which enables the creation of the essential elements for
				a component. Along with the elements, this object may also include additional properties
				such as stores to manage the component's state or helper functions that simplify interaction
				with the component.
			</slot>
		</svelte:fragment>
	</APITableHeading>

	<div class="mb-4 mt-4">
		<div class="overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-1/4 text-neutral-300">
							<td class="w-1/4 whitespace-nowrap py-2 pl-4 text-sm font-medium sm:pl-0">
								{tableHeading}
							</td>
							<td class="w-3/4 whitespace-nowrap py-2 text-sm font-medium">Description</td>
						</tr>
						{#each data as returnedProp}
							<tr>
								<td class="py-3 pl-4 pr-2 align-baseline sm:pl-0">
									<div class="mdsvex flex items-center gap-1.5">
										<div>
											{#if returnedProp.link}
												<a
													href={returnedProp.link}
													class="overflow-x-visible text-magnum-300 underline underline-offset-4 transition-all hover:underline-offset-[6px]"
												>
													<code>
														{returnedProp.name}
													</code>
												</a>
											{:else}
												<code>{returnedProp.name}</code>
											{/if}
										</div>
										{#if returnedProp.type}
											<InfoPopover iconClasses="text-neutral-200">
												<code class="inline-code neutral">
													{transformAPIString(returnedProp.type)}
												</code>
											</InfoPopover>
										{/if}
									</div>
								</td>
								<td class="py-3 align-baseline text-sm">
									{#if returnedProp.description}
										<div class="my-2 leading-7">
											<p>
												{@html transformAPIString(returnedProp.description, true)}
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
