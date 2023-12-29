<script lang="ts">
	import Collapsible from './Collapsible.svelte';
	let open = false;
</script>

<button on:click={() => (open = !open)}>open: {open}</button>
<Collapsible bind:open />
