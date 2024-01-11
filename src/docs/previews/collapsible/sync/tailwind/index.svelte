<script lang="ts">
	import Collapsible from './Collapsible.svelte';

	let open = false;
	let disabled = false;
</script>

<div class="mb-4 flex justify-center gap-4">
	<button
		on:click={() => (open = !open)}
		class="rounded-xl bg-white px-4 py-3
	font-medium leading-none text-magnum-700 shadow hover:opacity-75"
	>
		Open prop: {open}
	</button>
	<button
		on:click={() => (disabled = !disabled)}
		class="rounded-xl bg-white px-4 py-3
	font-medium leading-none text-magnum-700 shadow hover:opacity-75"
	>
		Disabled prop: {disabled}
	</button>
</div>

<Collapsible bind:open bind:disabled />
