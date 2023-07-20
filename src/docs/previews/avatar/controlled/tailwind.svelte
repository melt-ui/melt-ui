<script lang="ts">
	import {
		createAvatar,
		type AvatarOnLoadingStatusChange,
	} from '@melt-ui/svelte';

	const onLoadingStatusChange: AvatarOnLoadingStatusChange = (status) => {
		return status.next;
	};

	const {
		elements: { image, fallback },
	} = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/1162160?v=4',
		onLoadingStatusChange,
	});

	// With an exaggerated fallback delay
	const {
		elements: { image: imageA, fallback: fallbackA },
	} = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/5968653?v=4',
		delayMs: 650,
	});

	// A blank source to demonstrate the fallback
	const {
		elements: { image: imageB, fallback: fallbackB },
	} = createAvatar({
		src: '',
	});
</script>

<div class="flex w-full items-center justify-center gap-6">
	<div
		class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"
	>
		<img melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span melt={$fallback} class="text-3xl font-medium text-magnum-700">RH</span
		>
	</div>

	<div
		class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"
	>
		<img melt={$imageA} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span melt={$fallbackA} class="text-3xl font-medium text-magnum-700"
			>SH</span
		>
	</div>

	<div
		class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"
	>
		<img melt={$imageB} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span melt={$fallbackB} class="text-3xl font-medium text-magnum-700"
			>UI</span
		>
	</div>
</div>
