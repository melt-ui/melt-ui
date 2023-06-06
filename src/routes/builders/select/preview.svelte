<script lang="ts">
	import { createSelect } from '$lib/builders';

	const { open, selected, trigger, menu, option } = createSelect();
</script>

<div class="comp-preview comp-preview-colored mx-auto mt-16 h-96 w-screen max-w-xl">
	<button
		class="rounded-md bg-white px-4 py-1 text-vermilion-500
	hover:opacity-75"
		{...trigger()}
	>
		{$selected || 'Select an option'}
	</button>
	<ul class="rounded-md bg-white p-2 text-black" {...$menu}>
		<li {...$option({ value: 'option 1' })}>Option 1</li>
		<li {...$option({ value: 'option 2' })}>Option 2</li>
	</ul>
</div>
