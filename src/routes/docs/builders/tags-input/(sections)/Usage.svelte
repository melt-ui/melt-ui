<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from '../(snippets)';
</script>

<Docs.H2>Usage</Docs.H2>
<Docs.P class="mt-4">
	Use the <Docs.Code>createTagsInput</Docs.Code> builder function.
	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>CreateTagsInputArgs</Docs.Code> for available
		arguments
	</Docs.Callout>
	<Docs.CodeBlock code={snippets.usage1} />
</Docs.P>

<Docs.P class="mt-4">
	Use the return values to construct a <Docs.Code>tags-input</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.usage2} />

<Docs.H4>add</Docs.H4>
<Docs.P class="mt-4">
	An asynchronous <Docs.Code>add</Docs.Code> function may be passed into the builder. It is called after
	validation but prior to adding the tag to the <Docs.Code>$tags</Docs.Code> store.
</Docs.P>

<Docs.P class="mt-4">
	The function definition is <Docs.Code>(tag: string) =&gt Promise&ltTag | string&gt</Docs.Code>,
	whereby <Docs.Code>tag</Docs.Code> is the tag to be added to the <Docs.Code>$tags</Docs.Code> store.
</Docs.P>

<Docs.Callout type="info" class="mt-4">
	A <Docs.Code>Tag</Docs.Code> is an object that consists of an <Docs.Code>id</Docs.Code> and
	<Docs.Code>value</Docs.Code>.
</Docs.Callout>

<Docs.P class="mt-4">
	On <Docs.Code>resolve</Docs.Code>, if a <Docs.Code>string</Docs.Code> or a
	<Docs.Code>Tag</Docs.Code> without an id is returned, an id will be internally generated.
</Docs.P>

<Docs.P class="mt-4">
	On <Docs.Code>reject</Docs.Code>, the input is invalidated.
</Docs.P>

<Docs.P class="mt-4">
	An <Docs.Code>add</Docs.Code> function provides the ability define your own
	<Docs.Code>Tag</Docs.Code> manually. You can build an id manually, pull from a DB/3rd-party API, or
	simply manipulate the tag to always be uppercase, lowercase, replace whitespace with underscore, etc.
</Docs.P>

<Docs.P class="mt-4">
	The following example sets the <Docs.Code>id</Docs.Code> via a third-party API call and forces the
	tag to always be uppercase.
</Docs.P>
<Docs.CodeBlock code={snippets.usage3} />

<Docs.H4>remove</Docs.H4>
<Docs.P class="mt-4">
	An asynchronous <Docs.Code>remove</Docs.Code> function may be passed into the builder. It is called
	prior to removing the tag from the <Docs.Code>$tags</Docs.Code> store.
</Docs.P>

<Docs.P class="mt-4">
	The function definition is <Docs.Code>(tag: Tag) =&gt Promise&ltboolean&gt</Docs.Code>, whereby <Docs.Code
		>tag</Docs.Code
	> is the tag to be removed from the
	<Docs.Code>$tags</Docs.Code> store.
</Docs.P>

<Docs.Callout type="info" class="mt-4">
	A <Docs.Code>Tag</Docs.Code> is an object that consists of an <Docs.Code>id</Docs.Code> and
	<Docs.Code>value</Docs.Code>.
</Docs.Callout>

<Docs.P class="mt-4">
	A <Docs.Code>remove</Docs.Code> function provides the ability do something before the tag is removed
	from <Docs.Code>$tags</Docs.Code> store. For example, you could delete the tag from a backend DB.
</Docs.P>

<Docs.P class="mt-4">
	The following example disallowed the tag with the value <Docs.Code>one</Docs.Code> to be deleted.
</Docs.P>
<Docs.CodeBlock code={snippets.usage4} />
