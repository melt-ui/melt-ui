<script lang="ts">
	import { AspectRatio } from '$lib';
	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof AspectRatio>;
</script>

<div class="w-[300px] overflow-hidden rounded-md shadow-[0_2px_10px] shadow-black/25">
	<AspectRatio.Root ratio={propsObj.Root.ratio}>
		<img
			class="h-full w-full object-cover"
			src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
			alt="Landscape photograph by Tobias Tullius"
		/>
	</AspectRatio.Root>
</div>
