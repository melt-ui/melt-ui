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
	class="grid h-9 w-9 place-items-center items-center justify-center rounded bg-white text-base leading-4 text-vermilion-800 shadow-lg hover:bg-vermilion-100 focus:ring-2 focus:ring-black data-[disabled]:cursor-not-allowed data-[state=on]:bg-vermilion-200 data-[state=on]:text-vermilion-900"
	bind:pressed={propsObj.Root.pressed}
	bind:disabled={propsObj.Root.disabled}
>
	<Italic />
</Toggle.Root>
