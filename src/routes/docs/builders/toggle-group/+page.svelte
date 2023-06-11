<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Toggle Group</Docs.H1>
<Docs.Description>A set of two-state buttons that can be toggled on or off.</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
