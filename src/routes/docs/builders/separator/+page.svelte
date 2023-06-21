<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Separator</Docs.H1>
<Docs.Description>Visually or semantically separates content.</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />
