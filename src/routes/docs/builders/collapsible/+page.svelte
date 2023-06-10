<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Collapsible</Docs.H1>
<Docs.Description>An interactive component which expands/collapses a panel.</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<!-- <Docs.H2>API Reference</Docs.H2> -->
