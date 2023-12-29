<script lang="ts">
	import Collapsible from './Collapsible.svelte';
	let open = false;
	let disabled = false;
</script>

<button on:click={() => (open = !open)}>open: {open}</button>
<button on:click={() => (disabled = !disabled)}>disabled: {disabled}</button>
<Collapsible bind:open bind:disabled />
