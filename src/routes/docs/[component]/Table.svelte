<script lang="ts">
	import { cn } from '$routes/helpers';

	type Datum = $$Generic;

	export let head: string[];
	export let headMobile: string;
	export let data: Datum[];
</script>

{#each head as h}
	<span class="hidden text-sm text-zinc-300 lg:block">{h}</span>
{/each}
<span class="text-sm text-zinc-300 lg:hidden">{headMobile}</span>

<hr class="col-span-3 opacity-25" />

{#each data as datum, i}
	{@const isLast = i === data.length - 1}
	<div class={cn('flex flex-col gap-2 py-3 lg:contents', !isLast && 'border-b border-b-zinc-700')}>
		<slot name="row" {datum} />
	</div>
{:else}
	<slot name="empty" />
{/each}
