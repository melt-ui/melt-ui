<script lang="ts">
	import H3 from '../h3.svelte';
	import Li from '../li.svelte';
	import Ul from '../ul.svelte';

	export let features: string[];
</script>

<H3>Features</H3>
<Ul type="icon">
	{#each features as feature}
		<Li type="checked">{feature}</Li>
	{/each}
</Ul>
