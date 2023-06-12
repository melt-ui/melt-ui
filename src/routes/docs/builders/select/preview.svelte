<script lang="ts">
	import { createSelect } from '$lib';
	import { Docs } from '$routes/(components)';

	const { selectedText, trigger, menu, option } = createSelect();
</script>

<Docs.PreviewWrapper>
	<button
		class="rounded-md bg-white px-4 py-1 text-magnum-700 outline-none
	hover:opacity-75 focus:ring focus:ring-magnum-400"
		{...$trigger()}
	>
		{$selectedText || 'Select an option'}
	</button>

	<ul
		class="z-10 flex min-w-[200px] flex-col gap-2 rounded-md bg-white p-2 text-magnum-700"
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
</Docs.PreviewWrapper>
