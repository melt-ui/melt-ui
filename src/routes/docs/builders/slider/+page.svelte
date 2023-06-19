<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Slider</Docs.H1>
<Docs.Description>
	An input where the user selects a value from within a given range
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
