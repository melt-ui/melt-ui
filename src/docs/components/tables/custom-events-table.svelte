<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { transformAPIString } from '$docs/utils';
	import { APITableHeading } from '$docs/components';

	export let data: APISchema['customEvents'];
</script>

{#if data}
	<APITableHeading>
		Custom Events
		<svelte:fragment slot="info">
			We dispatch custom events for each normal event that we handle, and each of them are prefixed
			with<code class="neutral">m-</code>.
		</svelte:fragment>
	</APITableHeading>

	<div class="mb-4 mt-2">
		<div class="overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-full text-neutral-300">
							<td class="w-[50%] whitespace-nowrap py-2 pl-4 text-sm font-medium sm:pl-0">
								Event
							</td>
							<td class="w-[50%] whitespace-nowrap py-2 text-sm font-medium">Value</td>
						</tr>
						{#each data as { name, description }}
							<tr>
								<td class="py-3 pl-4 align-baseline sm:pl-0">
									<code>{`m-${name}`}</code>
								</td>
								<td class="py-3 align-baseline text-sm">
									<p>{@html transformAPIString(description)}</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
