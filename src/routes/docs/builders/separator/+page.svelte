<script lang="ts">
	import { Docs } from "$routes/(components)";
  import Preview from "./preview.svelte";
  import code from './code.ignore-svelte?raw';

</script>

<Docs.H1>Separator</Docs.H1>
<Docs.Description>
  Displays a horizontal or vertical line to separate content.
</Docs.Description>

<Preview  />

<Docs.CodeBlock code={code} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
  <Docs.Li>Can be horizontal or vertical</Docs.Li>
  <Docs.Li>Can be decorative or not</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
  <Docs.Li>
    <b>Separator:</b> The root container for the separator
  </Docs.Li>
</Docs.Ul>

<Docs.H2>Accessibility</Docs.H2>
<Docs.A href="https://www.w3.org/TR/wai-aria-1.2/#separator">WAI-ARIA role</Docs.A>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
  schema={{
    title: "CreateSeparatorArgs",
    description: "The object you pass into createSeparator. Optional.",
    args: [
      {
        label: "orientation",
        type: "enum",
        default: "'horizontal'",
      },
      {
        label: "decorative",
        type: "boolean",
        default: "false",
      },
    ],
  }}
/>