<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { createSwitch, melt } from '$lib/index.js';
	import { generateId } from '$lib/internal/helpers/index.js';
	import { writable } from 'svelte/store';

	export let checked: boolean | undefined = false;
	export let id: string = generateId();
	export let keepState = false;
	const checkedStore = writable(checked);

	const {
		elements: { root },
		states: { checked: isChecked },
	} = createSwitch({
		checked: checkedStore,
	});

	isChecked.subscribe((value) => {
		checked = value;
	});

	beforeNavigate(() => {
		if (keepState) return;
		checkedStore.set(false);
	});

	let labelId = generateId();
</script>

<div class="flex items-center gap-2">
	<label class="font-semibold text-white" id={labelId} for={id}><slot /></label>
	<button
		use:melt={$root}
		class="relative h-6 w-11 cursor-default rounded-full bg-magnum-900 outline-none
 data-[state=checked]:bg-magnum-700"
		{id}
		aria-labelledby={labelId}
	>
		<div
			class="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform
				{$isChecked && 'translate-x-[22px]'}"
		/>
	</button>
</div>
