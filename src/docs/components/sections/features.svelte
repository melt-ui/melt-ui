<script lang="ts">
	import { CheckCircle } from 'lucide-svelte';
	import { h2 as H2 } from '$docs/components/markdown';
	export let features: string[];
</script>

<H2>Features</H2>
<ul class="my-5 list-none">
	{#each features as feature}
		<li class="mt-2.5 flex items-center gap-3" {...$$restProps}>
			<CheckCircle class="text-green-400 square-5" />
			{feature}
		</li>
	{/each}
</ul>
