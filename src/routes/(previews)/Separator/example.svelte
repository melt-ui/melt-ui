<script lang="ts">
	import { Separator } from '$lib';
</script>


<div class="max-w-xs mx-4 w-full">
	<div class="text-white font-bold">
		Radix Svelte
	</div>
	<div class="text-white text-base">An open-source UI component library.</div>
	<Separator.Root class="bg-white data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
	<div class="flex items-center h-5">
		<div class="text-white text-base">Blog</div>
		<Separator.Root
			class="bg-white data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
			decorative
			orientation="vertical"
		/>
		<div class="text-white text-base">Docs</div>
		<Separator.Root
			class="bg-white data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
			decorative
			orientation="vertical"
		/>
		<div class="text-white text-base">Source</div>
	</div>
</div>

