<script lang="ts">
	import { Construction } from 'lucide-svelte';
	import { a as A } from '$docs/components/index.js';
</script>

<div
	class="my-4 flex flex-col items-start gap-2 rounded-xl border border-magnum-400 bg-magnum-900/25 p-4
	lg:flex-row lg:items-center"
>
	<p>
		<Construction class="shrink-0 text-magnum-400 square-8 lg:inline-block lg:square-6" />
		<span class="font-bold">In Construction:</span>
		<slot>
			This page is still a WIP. Please check back later, or help us by contributing to
			<A href="https://github.com/melt-ui/melt-ui">Melt UI</A>.
		</slot>
	</p>
</div>
