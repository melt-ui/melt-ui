<script lang="ts">
	import { Avatar } from '$lib';
</script>

<div class="flex gap-4">
	<Avatar.Root
		class="h-32 w-32 select-none items-center justify-center overflow-hidden rounded-full"
	>
		<Avatar.Image
			class="h-full w-full rounded-[inherit] object-cover"
			src="https://avatars.githubusercontent.com/u/26071571"
			alt="Alt"
		/>
		<Avatar.Fallback
			class="flex h-full w-full items-center justify-center bg-white text-4xl font-medium text-vermilion-500"
			data-testid="fallback"
		>
			TGL
		</Avatar.Fallback>
	</Avatar.Root>
</div>
