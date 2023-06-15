<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Pagination</Docs.H1>
<Docs.Description>
	An interface that allows navigating between pages that contain split entries.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
