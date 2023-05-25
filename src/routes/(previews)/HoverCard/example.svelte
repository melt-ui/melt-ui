<script lang="ts">
	import { HoverCard } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';

	export let propsObj: ResolvedProps<typeof HoverCard>;
</script>

<div class="contents">
	<HoverCard.Root
		open={propsObj.Root.open}
		openDelay={propsObj.Root.openDelay}
		closeDelay={propsObj.Root.closeDelay}
	>
		<HoverCard.Trigger
			href="https://github.com/TGlide/radix-svelte"
			class="rounded-full p-2 outline-none ring-black focus:ring"
		>
			<img class="h-8 w-8" src="/radix-svelte.svg" alt="Radix and Svelte logos" />
		</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content
				side={propsObj.Content.side}
				sideOffset={propsObj.Content.sideOffset}
				align={propsObj.Content.align}
				alignOffset={propsObj.Content.alignOffset}
				arrowPadding={propsObj.Content.arrowPadding}
				collisionPadding={propsObj.Content.collisionPadding}
				sticky={propsObj.Content.sticky}
				hideWhenDetached={propsObj.Content.hideWhenDetached}
				avoidCollisions={propsObj.Content.avoidCollisions}
				class="w-80 rounded-sm bg-white p-5 shadow-sm"
			>
				<HoverCard.Arrow width={20} height={10} class="fill-white" />
				<div class="flex flex-col gap-2">
					<img
						src="/radix-svelte.svg"
						class="block h-12 w-12 rounded-[100%] bg-vermilion-600 object-cover p-2"
						alt="Radix and Svelte logos"
					/>
					<div class="flex flex-col gap-4">
						<div>
							<div class="font-bold text-black">Radix Svelte</div>
							<div class="font-light text-zinc-400">TGlide/radix-svelte</div>
						</div>
					</div>
					<div class="m-0 text-zinc-700">
						A set of unstyled, accessible components for building high-quality design systems and
						web apps
					</div>
					<div class="flex gap-4">
						<div class="flex gap-1">
							<div class="font-thin text-black">229</div>
							<div class="font-thin text-zinc-400">Stars</div>
						</div>
						<div class="flex gap-1">
							<div class="font-thin text-black">23</div>
							<div class="font-thin text-zinc-400">Forks</div>
						</div>
					</div>
				</div>
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>
</div>
