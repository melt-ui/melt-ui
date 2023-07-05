<script lang="ts">
	import CheckCircle from '~icons/lucide/check-circle';
	import { h2 as H2 } from './markdown';
	export let features: string[];
</script>

<H2>Features</H2>
<ul class="my-5 list-none">
	{#each features as feature}
		<li class="mt-2.5 flex items-center gap-3" {...$$restProps}>
			<CheckCircle class="h-6 w-6 text-green-400" />
			{feature}
		</li>
	{/each}
</ul>
