<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Toggle</Docs.H1>
<Docs.Description>A two-state button that can be either on or off.</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
