<script lang="ts">
	import { createAvatar, createLinkPreview, melt } from '$lib/index.js';
	import type { FullContributor } from '$routes/docs/[...slug]/+layout.server.js';
	import { fly } from 'svelte/transition';

	export let contributor: FullContributor;

	const getInitials = (name: string) => {
		const [first, last] = name.split(' ');
		if (last) {
			return `${first[0]}${last[0]}`.toUpperCase();
		}
		return first.slice(0, 2).toUpperCase();
	};

	const {
		elements: { image, fallback },
	} = createAvatar({
		src: contributor.avatar_url,
	});

	const {
		elements: { trigger, content },
		states: { open },
	} = createLinkPreview({
		forceVisible: true,
		positioning: {
			placement: 'top',
		},
		closeDelay: 100,
		openDelay: 250,
	});
</script>

<a
	class="avatar"
	href={contributor.html_url}
	target="_blank"
	rel="noopener noreferrer"
	use:melt={$trigger}
>
	<img use:melt={$image} alt="Avatar" class="avatar" />
	<div use:melt={$fallback} class="fallback">
		{getInitials(contributor.name ?? contributor.login)}
	</div>
</a>

{#if $open}
	<div
		class="z-50 w-[320px] rounded-xl border border-neutral-700/50 bg-neutral-800 p-4 shadow"
		use:melt={$content}
		transition:fly={{ duration: 150, y: 4 }}
	>
		<div class="flex flex-col gap-4">
			<img
				class="h-16 w-16 rounded-full"
				src={contributor.avatar_url}
				alt="{contributor.login}'s avatar"
			/>
			<div class="flex flex-col">
				<h3 class="text-lg font-medium">{contributor.name ?? contributor.login}</h3>
				<p class="mb-2 text-sm text-neutral-400">{contributor.login}</p>
				{#if contributor.bio}
					<p class="mb-2 text-sm text-neutral-300">{contributor.bio}</p>
				{/if}
				<p class="text-xs text-neutral-400">
					<span class="font-semibold">{contributor.contributions}</span> contributions
				</p>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.avatar {
		display: block;

		--size: 4rem;
		width: var(--size);
		height: var(--size);

		background: theme('colors.neutral.900');
		border-radius: 100%;
		border: 2px solid theme('colors.neutral.900');

		display: grid;
		place-items: center;

		img {
			border-radius: 100%;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.fallback {
			font-size: 1.25rem;
			font-weight: 600;
			background-color: theme('colors.neutral.700');
			color: theme('colors.magnum.300');

			width: 100%;
			height: 100%;
			border-radius: 100%;
			display: grid;
			place-items: center;
		}
	}
</style>
