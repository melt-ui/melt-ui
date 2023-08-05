<script lang="ts">
	import type { KeyboardSchema } from '$docs/types.js';
	import { Kbd } from '$docs/components/index.js';
	import { transformAPIString } from '$docs/utils/index.js';

	export let keyboard: KeyboardSchema;
</script>

{#if keyboard && keyboard.length}
	<div class="mb-12 mt-4">
		<div class="overflow-x-auto sm:mx-0">
			<div class="inline-block min-w-full">
				<table class="w-full min-w-[540px] border-b border-neutral-700 text-left sm:min-w-full">
					<tbody class="divide-y divide-neutral-700">
						<tr class="w-full text-neutral-300">
							<td class="w-1/6 whitespace-nowrap py-2 pl-4 pr-4 text-sm font-medium sm:pl-0">
								Key
							</td>
							<td class="w-5/6 whitespace-nowrap py-2 text-sm font-medium">Behavior</td>
						</tr>
						{#each keyboard as { key, behavior }}
							<tr>
								<td class="py-3 pl-4 pr-4 align-baseline sm:pl-0">
									<Kbd>{key}</Kbd>
								</td>
								<td class="py-3 align-baseline text-sm">
									<p>{@html transformAPIString(behavior, true)}</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
