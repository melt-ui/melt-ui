<script lang="ts" context="module">
	export const props = {
		Root: {
			props: {
				pressed: {
					type: 'boolean'
				}
			}
		}
	} satisfies RadixComponentGroupPreview<typeof Toggle>;
</script>

<script lang="ts">
	import { Toggle } from '$lib';
	import FontItalicIcon from '~icons/radix-icons/font-italic';
	import { getPropsObj, type RadixComponentGroupPreview } from '../helpers';

	export let propsObj = getPropsObj(props);
</script>

<Toggle.Root
	aria-label="Toggle italic"
	class="grid h-9 w-9 place-items-center items-center
    justify-center rounded bg-white text-base leading-4 text-violet-800 shadow-sm 
		shadow-black/50 hover:bg-violet-100 focus:ring-2 focus:ring-black
    data-[state=on]:bg-violet-200 data-[state=on]:text-violet-900"
	bind:pressed={propsObj.Root.pressed}
>
	<FontItalicIcon />
</Toggle.Root>
