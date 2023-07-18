<script lang="ts">
	import { createAvatar } from '@melt-ui/svelte';

	const { image, fallback } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/1162160?v=4',
	});

	// With an exaggerated fallback delay
	const { image: imageA, fallback: fallbackA } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/5968653?v=4',
		delayMs: 650,
	});

	// A blank source to demonstrate the fallback
	const { image: imageB, fallback: fallbackB } = createAvatar({
		src: '',
	});
</script>

<div class="root">
	<div class="item">
		<img melt={$image} alt="Avatar" class="avatar" />
		<span melt={$fallback} class="fallback">RH</span>
	</div>

	<div class="item">
		<img melt={$imageA} alt="Avatar" class="avatar" />
		<span melt={$fallbackA} class="fallback">SH</span>
	</div>

	<div class="item">
		<img melt={$imageB} alt="Avatar" class="avatar" />
		<span melt={$fallbackB} class="fallback">UI</span>
	</div>
</div>

<style>
	.root {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: var(--tw-size-6);
	}

	.item {
		display: flex;
		height: var(--tw-size-16);
		width: var(--tw-size-16);
		align-items: center;
		justify-content: center;
		border-radius: var(--tw-rounded-full);
		--tw-bg-opacity: 1;
		background-color: rgb(245 245 245 / var(--tw-bg-opacity));
	}

	.item > .avatar {
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	.item > .fallback {
		font-size: var(--tw-font-size-3xl);
		line-height: var(--tw-line-height-3xl);
		font-weight: var(--tw-font-weight-medium);
		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));
	}
</style>
