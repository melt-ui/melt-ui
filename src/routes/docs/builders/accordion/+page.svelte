<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Accordion</Docs.H1>
<Docs.Description>
	A vertically stacked set of interactive headings that each reveal an associated section of
	content.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<!-- <Docs.H2>API Reference</Docs.H2> -->
