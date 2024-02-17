<script lang="ts">
	import { CheckCircle } from '$icons/index.js';
	import { h2 as H2 } from '$docs/components/markdown/index.js';
	export let features: string[];
</script>

<H2>Features</H2>
<ul class="my-5 list-none">
	{#each features as feature}
		<li class="mt-2.5 flex items-center gap-3" {...$$restProps}>
			<CheckCircle class="size-5 shrink-0 text-green-400" />
			{feature}
		</li>
	{/each}
</ul>
