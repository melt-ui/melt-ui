<script lang="ts">
	import List from './list.svelte';
	import Root from './root.svelte';

	export let tabs: string[] = [];
</script>

<Root {tabs} let:tab>
	<List />
	<slot {tab} />
</Root>
