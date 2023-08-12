<script lang="ts">
	import type { APISchema } from '$docs/types.js';
	import { APITableHeading } from '$docs/components/index.js';
	import CustomEventDialog from '../custom-event-dialog.svelte';

	export let data: APISchema['events'];
</script>

{#if data}
	<APITableHeading>
		Custom Events
		<svelte:fragment slot="info">
			Custom events are dispatched with each normal event that we handle. You can override the way
			we handle these events by calling
			<code class="neutral">e.detail.cancel()</code> in your event listener.
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
						{#each data as { name }}
							<tr>
								<td class="py-3 pl-4 align-baseline sm:pl-0">
									<code>{name}</code>
								</td>
								<td class="py-3 align-baseline text-sm">
									<CustomEventDialog />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
