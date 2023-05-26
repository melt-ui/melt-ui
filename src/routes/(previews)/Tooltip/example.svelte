<script lang="ts">
	import { Tooltip } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Plus from '~icons/lucide/plus';

	export let propsObj: ResolvedProps<typeof Tooltip>;
</script>

<Tooltip.Provider
	delayDuration={propsObj.Provider.delayDuration}
	skipDelayDuration={propsObj.Provider.skipDelayDuration}
	disableHoverableContent={propsObj.Provider.disableHoverableContent}
>
	<Tooltip.Root
		bind:open={propsObj.Root.open}
		delayDuration={propsObj.Root.delayDuration}
		disableHoverableContent={propsObj.Root.disableHoverableContent}
	>
		<Tooltip.Trigger
			class="hover:opacity/75 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white
			text-vermilion-500 shadow-sm outline-none focus:ring focus:ring-black"
			aria-label="Add to library"
		>
			<Plus />
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				side={propsObj.Content.side}
				sideOffset={propsObj.Content.sideOffset}
				align={propsObj.Content.align}
				alignOffset={propsObj.Content.alignOffset}
				arrowPadding={propsObj.Content.arrowPadding}
				collisionPadding={propsObj.Content.collisionPadding}
				sticky={propsObj.Content.sticky}
				hideWhenDetached={propsObj.Content.hideWhenDetached}
				avoidCollisions={propsObj.Content.avoidCollisions}
				class="select-none rounded-md
				bg-white px-4
				py-2 leading-none text-vermilion-500 shadow-md will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade 
				data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
			>
				Add to library

				<Tooltip.Arrow
					width={propsObj.Arrow.width}
					height={propsObj.Arrow.height}
					class="fill-white"
				/>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
