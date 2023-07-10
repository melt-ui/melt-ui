<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { transformAPIString } from '$docs/utils';
	import { APITableHeading } from '$docs/components';

	export let data: APISchema['returnedProps'];
</script>

{#if data}
	<APITableHeading>
		Returned Props
		<svelte:fragment slot="info">
			Builder functions return props that can be used to render the elements needed for the
			component, as well as a few other props that can be used to manage the state of the component.
		</svelte:fragment>
	</APITableHeading>

	<div class="mb-6 mt-4">
		<div class="overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-1/4 text-neutral-300">
							<td class="w-[20%] whitespace-nowrap py-2 pl-4 text-sm font-medium sm:pl-0">
								Returned Prop
							</td>
							<td class="w-[35%] whitespace-nowrap py-2 text-sm font-medium">Type</td>
							<td class="w-[45%] whitespace-nowrap py-2 text-sm font-medium">Description</td>
						</tr>
						{#each data as returnedProp}
							<tr>
								<td class=" py-3 pl-4 align-baseline sm:pl-0">
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
								</td>
								<td class="py-3 align-baseline text-sm">
									<div class="my-0 space-x-5 whitespace-nowrap">
										{#if returnedProp.type}
											<code class="neutral">
												{transformAPIString(returnedProp.type)}
											</code>
										{:else}
											-
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
