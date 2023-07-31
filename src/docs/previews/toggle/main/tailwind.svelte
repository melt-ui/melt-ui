<script lang="ts">
	import { createToggle } from '$lib';
	import Italic from '~icons/lucide/italic';

	const { toggle } = createToggle();
</script>

<button
	melt={$toggle}
	aria-label="Toggle italic"
	class="grid h-9 w-9 place-items-center items-center justify-center rounded
	bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100
    data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200
    data-[state=on]:text-magnum-900"
>
	<Italic />
</button>
