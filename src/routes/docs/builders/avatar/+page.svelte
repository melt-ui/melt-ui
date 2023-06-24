<script>
	import { Docs } from "$routes/(components)";
	import Preview from "./preview.svelte";
  import code from './code.ignore-svelte?raw';


</script>
<Docs.H1>Avatar</Docs.H1>
<Docs.P>Avatar is a component that displays a user's profile picture.</Docs.P>

<Preview />

<Docs.CodeBlock code={code} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
  <Docs.Li>Supports custom fallback</Docs.Li>
  <Docs.Li>Supports custom size</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
  <Docs.Li><b>Root:</b> The root container for the avatar</Docs.Li>
  <Docs.Li>
    <b>Image:</b> The image element that displays the user's profile picture
  </Docs.Li>
  <Docs.Li>
    <b>Fallback:</b> The fallback element that displays whatever you want when the image fails to load
  </Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
  schema={{
    title: 'CreateAvatarArgs',
    description: 'The object you pass into createAvatar.',
    args: [
      {
        label: 'src',
        type: 'string',
        default: '""',
      },
    ],
  }}
/>
