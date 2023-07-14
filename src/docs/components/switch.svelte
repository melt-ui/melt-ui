<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { createSwitch } from '$lib';

	export let checked = false;
	export let id: string;
	export let keepState = false;

	const {
		root,
		isChecked,
		checked: checkedStore,
	} = createSwitch({
		checked,
	});

	isChecked.subscribe((value) => {
		checked = value;
	});

	beforeNavigate(() => {
		if (keepState) return;
		checkedStore.set(false);
	});
</script>

<div class="flex items-center gap-2">
	<label class="font-semibold text-white" for={id}><slot /></label>
	<button
		melt={$root}
		class="relative h-6 w-11 cursor-default rounded-full bg-magnum-900 outline-none
 data-[state=checked]:bg-magnum-700"
		{id}
	>
		<div
			class="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform
				{$isChecked && 'translate-x-[22px]'}"
		/>
	</button>
</div>
