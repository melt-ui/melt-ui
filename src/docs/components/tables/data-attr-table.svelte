<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { transformAPIString } from '$docs/utils';

	export let data: APISchema['dataAttributes'];
</script>

{#if data}
	<div class="mb-12 mt-8">
		<div class="-mx-4 overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] border-b border-neutral-700 text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-full text-neutral-300">
							<td class="w-[50%] whitespace-nowrap py-2 pl-4 text-sm font-medium sm:pl-0">
								Data Attribute
							</td>
							<td class="w-[50%] whitespace-nowrap py-2 text-sm font-medium">Value</td>
						</tr>
						{#each data as { label, value }}
							<tr>
								<td class="py-3 pl-4 align-baseline sm:pl-0">
									<code>{`[${label}]`}</code>
								</td>
								<td class="py-3 align-baseline text-sm">
									<p>{@html transformAPIString(value)}</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
