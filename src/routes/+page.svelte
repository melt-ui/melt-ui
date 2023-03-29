<script lang="ts">
	import Accordion from './(previews)/Accordion.svelte';
	import Collapsible from './(previews)/Collapsible.svelte';
</script>

<div class="wrapper">
	<Accordion />
	<Collapsible />
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		padding: theme('spacing.4');
		gap: theme('spacing.8');

		@media screen('md') {
			grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		}
	}
</style>
