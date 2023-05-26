<script lang="ts">
	import { Tooltip } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	import Plus from '~icons/lucide/plus';

	export let propsObj: ResolvedProps<typeof Tooltip>;
</script>

<Tooltip.Provider>
	<Tooltip.Root disableHoverableContent>
		<Tooltip.Trigger
			class="shadow-blackA7 hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-vermilion-500 shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
		>
			<Plus />
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				class="a data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade
				data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade
				data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade 
				select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none 
				text-vermilion-500 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
				sideOffset={8}
			>
				Add to library
				<Tooltip.Arrow class="fill-white" />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
