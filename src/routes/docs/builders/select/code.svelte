<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	const { selectedText, trigger, menu, option } = createSelect();
</script>

<button
	class="rounded-md bg-white px-4 py-1 text-magnum-700 outline-none
	hover:opacity-75 focus:ring focus:ring-magnum-400"
	{...$trigger()}
>
	{$selectedText || 'Select an option'}
</button>

<ul
	class="absolute flex min-w-[200px] translate-y-2 flex-col gap-2 rounded-md bg-white p-2 text-magnum-700"
	{...$menu}
>
	<li
		class="cursor-pointer rounded-md px-4 py-1 outline-none hocus:bg-zinc-200"
		{...$option({ value: 'option-1' })}
	>
		Option 1
	</li>
	<li
		class="cursor-pointer rounded-md px-4 py-1 outline-none hocus:bg-zinc-200"
		{...$option({ value: 'option-2' })}
	>
		Option 2
	</li>
</ul>
