<script lang="ts">
	import { createSwitch, melt } from '$lib/index.js';

	const {
		elements: { root, input },
		states: { checked },
	} = createSwitch({
		defaultChecked: true,
	});

	let className = '';
	export { className as class };
</script>

<form class={className}>
	<div class="flex items-center">
		<button
			use:melt={$root}
			class="relative h-10 w-[5rem] cursor-default rounded-full bg-magnum-800
			transition-colors"
			id="airplane-mode"
			aria-label="Switch"
		>
			<span
				class="block size-8 rounded-full transition will-change-transform
				{$checked ? 'translate-x-[2.75rem] bg-white' : 'translate-x-1 bg-white/50'}"
			/>
		</button>
		<input use:melt={$input} />
	</div>
</form>
