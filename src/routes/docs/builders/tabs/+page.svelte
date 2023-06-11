<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Tabs</Docs.H1>
<Docs.Description>
	A set of layered sections of content—known as tab panels—that are displayed one at a time.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
