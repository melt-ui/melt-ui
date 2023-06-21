<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { createSeparator } from '@melt-ui/svelte/builders/separator';

	const { separator: horizontalSeparator } = createSeparator();
	const { separator: verticalSeparator } = createSeparator({ orientation: 'vertical' });
</script>

<Docs.PreviewWrapper>
	<div class="mx-4 w-full max-w-xs">
		<div class="font-bold text-white">Melt UI</div>
		<div class="text-base text-white">An open-source UI component library.</div>
		<div
			{...$horizontalSeparator}
			class="my-4 bg-white data-[orientation=horizontal]:h-px
				   data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full
				   data-[orientation=vertical]:w-px"
		/>
		<div class="flex h-5 items-center">
			<div class="text-base text-white">Blog</div>
			<div
				{...$verticalSeparator}
				class="mx-4 bg-white data-[orientation=horizontal]:h-px
					   data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full
					   data-[orientation=vertical]:w-px"
			/>
			<div class="text-base text-white">Docs</div>
			<div
				{...$verticalSeparator}
				class="mx-4 bg-white data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
			/>
			<div class="text-base text-white">Source</div>
		</div>
	</div>
</Docs.PreviewWrapper>
