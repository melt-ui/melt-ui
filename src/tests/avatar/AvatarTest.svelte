<script lang="ts">
	import { createAvatar, melt } from '$lib/index.js';

	export let src = 'https://avatars.githubusercontent.com/u/1162160?v=4';

	const {
		elements: { image, fallback },
	} = createAvatar({
		src,
	});
</script>

<div class="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
	<img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" data-testid="image" />
	<span use:melt={$fallback} class="text-3xl font-medium text-black" data-testid="fallback">RH</span
	>
</div>
