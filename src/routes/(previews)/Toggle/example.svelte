<script lang="ts">
	import { Toggle } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Italic from '~icons/lucide/italic';

	export let propsObj: ResolvedProps<typeof Toggle>;
</script>

<Toggle.Root
	aria-label="Toggle italic"
	class="grid justify-center items-center place-items-center w-9 h-9 text-base leading-4 bg-white rounded shadow-lg focus:ring-2 focus:ring-black text-vermilion-800 data-[disabled]:cursor-not-allowed data-[state=on]:bg-vermilion-200 data-[state=on]:text-vermilion-900 hover:bg-vermilion-100"
	bind:pressed={propsObj.Root.pressed}
	bind:disabled={propsObj.Root.disabled}
>
	<Italic />
</Toggle.Root>
