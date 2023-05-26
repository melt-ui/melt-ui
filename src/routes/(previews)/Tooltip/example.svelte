<script lang="ts">
	import { Tooltip } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Plus from '~icons/lucide/plus';

	export let propsObj: ResolvedProps<typeof Tooltip>;
</script>

<Tooltip.Provider>
	<Tooltip.Root bind:open={propsObj.Root.open}>
		<Tooltip.Trigger
			class="hover:opacity/75 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white
			text-vermilion-500 shadow-sm outline-none focus:ring focus:ring-black"
			aria-label="Add to library"
		>
			<Plus />
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				class="select-none rounded-md bg-white px-4 py-2 leading-none text-vermilion-500 shadow-md 
				will-change-[transform,opacity]"
				sideOffset={8}
			>
				Add to library
				<Tooltip.Arrow class="fill-white" />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
