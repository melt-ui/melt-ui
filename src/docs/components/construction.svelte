<script lang="ts">
	import Construction from '~icons/lucide/construction';
	import { a as A } from '$docs/components';
</script>

<div
	class="my-4 flex flex-col items-start gap-2 rounded-md border border-magnum-500 bg-magnum-500/10 p-4
	lg:flex-row lg:items-center"
>
	<Construction class="shrink-0 text-magnum-300 square-8 lg:square-6" />
	<p>
		<span class="font-bold">In Construction:</span>
		<slot>
			This page is still a WIP. Please check back later, or help us by contributing to
			<A href="https://github.com/melt-ui/melt-ui">Melt UI</A>.
		</slot>
	</p>
</div>
