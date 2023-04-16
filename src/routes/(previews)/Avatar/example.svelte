<script lang="ts">
	import { Avatar } from '$lib';
	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof Avatar>;
</script>

<div class="flex gap-4">
	<Avatar.Root
		class="h-32 w-32 select-none items-center justify-center overflow-hidden rounded-full"
	>
		<Avatar.Image
			class="h-full w-full rounded-[inherit] object-cover"
			src={propsObj.Image.src}
			alt={propsObj.Image.alt}
			on:loadingStatusChange={(e) => console.log(e.detail)}
		/>
		<Avatar.Fallback
			class="flex h-full w-full items-center justify-center bg-white text-4xl font-medium text-vermilion-500"
			delayMs={propsObj.Fallback.delayMs}
		>
			TL
		</Avatar.Fallback>
	</Avatar.Root>
</div>
