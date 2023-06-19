<script lang="ts">
	import List from './list.svelte';
	import Root from './root.svelte';

	export let tabs: string[] = [];
</script>

<Root {tabs} let:tab>
	<List />
	<div class="mt-2">
		<slot {tab} />
	</div>
</Root>
