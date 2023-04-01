<script lang="ts">
	import { Toggle } from '$lib';
	import { FontItalicIcon } from '$lib/components/Icon';
</script>

<Toggle.Root
	aria-label="Toggle italic"
	class="shadow-black/50 grid h-9 w-9 place-items-center
    items-center justify-center rounded bg-white text-base leading-4 text-violet-800 
		shadow-sm hover:bg-violet-100 focus:ring-2 focus:ring-black
    data-[state=on]:bg-violet-200 data-[state=on]:text-violet-900"
>
	<FontItalicIcon />
</Toggle.Root>
