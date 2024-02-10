<script lang="ts">
	import { createToggle, melt, overridable } from '$lib/index.js';
	import { Italic } from '$icons/index.js';
	import { writable } from 'svelte/store';

	const {
		elements: { root },
	} = createToggle({
		pressed: overridable(false, ({ curr, next }) => {
			console.log('pressed', curr, next);
			return next;
		}),
		// or pressed: writable(false),
		// or pressed: false,
	});
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="grid h-9 w-9 place-items-center items-center justify-center rounded-md
	bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100
    data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200
    data-[state=on]:text-magnum-900"
>
	<Italic class="size-4" />
</button>
