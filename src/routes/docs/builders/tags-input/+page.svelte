<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
	import { schemas } from './schemas';

	export let data;

	const features = [
		'Type in the input and press enter to add tags',
		'Keyboard navigation',
		'Delete tags',
		'Edit tags',
		'Disable everything or disable specific tags',
		'Only allow unique tags',
		'Add a tag on paste',
		'Set a maximum number of tags allowed',
		'Support for allowed/denied lists',
		'Provide add/remove function to call before adding/removing a tag',
	];
</script>

<Docs.H1>Tags Input</Docs.H1>
<Docs.Description>Render tags inside an input, followed by an actual text input.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the tags input</Docs.Li>
	<Docs.Li><b>Tag:</b> The tag container for an individual tag</Docs.Li>
	<Docs.Li><b>Delete Trigger:</b> The button container, to delete an individual tag</Docs.Li>
	<Docs.Li><b>Edit:</b> An edit container, to edit an individual tag</Docs.Li>
	<Docs.Li><b>Input:</b> The input textbox for adding new tags</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	Use the <Docs.Code>createTagsInput</Docs.Code> builder function.
	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>CreateTagsInputArgs</Docs.Code> for available
		arguments
	</Docs.Callout>
	<Docs.CodeBlock code={snippets.usage1} />
</Docs.P>

<Docs.P>
	Use the return values to construct a <Docs.Code>tags-input</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.usage2} />

<Docs.H4>Add</Docs.H4>
<Docs.P>
	<Docs.P>
		An asynchronous <Docs.Code>add</Docs.Code> function may be passed into the builder. It is called
		prior to adding the tag to the <Docs.Code>$tags</Docs.Code> store.
	</Docs.P>

	<Docs.P>
		It provides you the ability to validate the input value, set a custom id, for example from a
		backend or 3rd-party API, or update the value to always be uppercase, lowercase, etc.
	</Docs.P>

	<Docs.P>
		The function definition is <Docs.Code>(tag: string) =&gt Promise&ltTag | string&gt</Docs.Code>,
		whereby <Docs.Code>tag</Docs.Code> is the input value.
	</Docs.P>

	<Docs.Callout type="info">
		A <Docs.Code>Tag</Docs.Code> is an object that consists of an <Docs.Code>id</Docs.Code> and
		<Docs.Code>value</Docs.Code>.
	</Docs.Callout>

	<Docs.P>
		On <Docs.Code>resolve</Docs.Code>, if a <Docs.Code>string</Docs.Code> is returned, an id will be
		internally generated. The same happens when a <Docs.Code>Tag</Docs.Code> without an id is returned.
	</Docs.P>

	<Docs.P>
		On <Docs.Code>reject</Docs.Code> or <Docs.Code>error</Docs.Code>, the input is invalidated and
		not added to the store.
	</Docs.P>

	<Docs.P>
		The following example sets the id via a third-party API call and forces the tag to always be
		uppercase.
	</Docs.P>

	<Docs.CodeBlock code={snippets.usage3} />
</Docs.P>

<Docs.H4>Update</Docs.H4>
<Docs.P>
	<Docs.P>
		An asynchronous <Docs.Code>update</Docs.Code> function may be passed into the builder. It is called
		prior to updating a tag in <Docs.Code>$tags</Docs.Code> store, following an edit.
	</Docs.P>

	<Docs.P>
		It provides the ability do something before a tag is updated, such as updating the value in a
		backend database, setting a new id, or simply manipulating the value to be added.
	</Docs.P>

	<Docs.P>
		The function definition is <Docs.Code>(tag: Tag) =&gt Promise&ltTag&gt</Docs.Code>.
	</Docs.P>

	<Docs.Callout type="info">
		A <Docs.Code>Tag</Docs.Code> is an object that consists of an <Docs.Code>id</Docs.Code> and
		<Docs.Code>value</Docs.Code>.
	</Docs.Callout>

	<Docs.P>
		<Docs.Code>tag.value</Docs.Code> will be the new (edited) value, while
		<Docs.Code>tag.id</Docs.Code> will be the existing id.
	</Docs.P>

	<Docs.P>
		On <Docs.Code>reject</Docs.Code> or <Docs.Code>error</Docs.Code> the tag is not updated.
	</Docs.P>

	<Docs.P>The following example uses the existing id and sets the value to uppercase</Docs.P>

	<Docs.CodeBlock code={snippets.usage4} />
</Docs.P>

<Docs.H4>Remove</Docs.H4>
<Docs.P>
	<Docs.P>
		An asynchronous <Docs.Code>remove</Docs.Code> function may be passed into the builder. It is called
		prior to removing the tag from the <Docs.Code>$tags</Docs.Code> store.
	</Docs.P>

	<Docs.P>
		It provides the ability do something before the tag is removed from <Docs.Code>$tags</Docs.Code>
		store, such as deleting the tag from a backend database.
	</Docs.P>

	<Docs.P>
		The function definition is <Docs.Code>(tag: Tag) =&gt Promise&ltboolean&gt</Docs.Code>, whereby
		<Docs.Code>tag</Docs.Code> is the tag to be removed from the <Docs.Code>$tags</Docs.Code> store.
	</Docs.P>

	<Docs.Callout type="info">
		A <Docs.Code>Tag</Docs.Code> is an object that consists of an <Docs.Code>id</Docs.Code> and
		<Docs.Code>value</Docs.Code>.
	</Docs.Callout>

	<Docs.P>
		On <Docs.Code>reject</Docs.Code>, <Docs.Code>error</Docs.Code> or <Docs.Code>false</Docs.Code>,
		the tag is not removed from the store.
	</Docs.P>

	<Docs.P>
		The following example disallows a tag with the value <Docs.Code>one</Docs.Code> to be deleted.
	</Docs.P>

	<Docs.CodeBlock code={snippets.usage5} />
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.tag} />
<Docs.API schema={schemas.deleteTrigger} />
<Docs.API schema={schemas.edit} />
<Docs.API schema={schemas.options} />
<Docs.API schema={schemas.tags} />
<Docs.API schema={schemas.selected} />
<Docs.API schema={schemas.inputValue} />
<Docs.API schema={schemas.inputInvalid} />
<Docs.API schema={schemas.isSelected} />
<Docs.API schema={schemas.keyboard} />
