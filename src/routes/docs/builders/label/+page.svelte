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

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
  <Docs.Li>Can be used with any input element</Docs.Li>
  <Docs.Li>Support nested controls</Docs.Li>
  <Docs.Li>Can add an asterisk at the end if the field is required</Docs.Li>
  <Docs.Li>Text selection is prevented when double clicking label</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
  <Docs.Li>
    <b>Root:</b> The root container for the label
  </Docs.Li>
  <Docs.Li>
    <b>Asterisk:</b> The asterisk element
  </Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
  To create a label, use the <Docs.Code>createLabel</Docs.Code> builder
  function. Follow the anatomy or the example above to create your label.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={{
  title: 'CreateLabelArgs',
  description: 'The arguments for the createLabel function. Optional',
  args: [
    {
      label: 'isRequired',
      type: 'boolean',
      default: 'false',
    },
  ],
}} />