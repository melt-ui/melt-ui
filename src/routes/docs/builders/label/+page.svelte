<script lang="ts">
  import { Docs } from '$routes/(components)';
  // import { snippets } from './(snippets)';
  import code from './code.ignore-svelte?raw';
  import Preview from './preview.svelte';
</script>

<Docs.H1>Label</Docs.H1>
<Docs.Description
  >A control that add a label to an input element.</Docs.Description>

  <Preview />

<Docs.CodeBlock {code} />