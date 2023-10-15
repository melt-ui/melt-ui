<script lang="ts">
	import { page } from '$app/stores';
	import type { FullContributor } from '$routes/docs/[...slug]/+page.server';

	import Contributor from './contributor.svelte';

	const contributors = $page.data.contributors as FullContributor[] | undefined;
</script>

<ul class="ml-2 flex flex-wrap gap-y-4">
	{#each contributors ?? [] as contributor}
		<li class="-ml-3">
			<Contributor {contributor} />
		</li>
	{/each}
</ul>
