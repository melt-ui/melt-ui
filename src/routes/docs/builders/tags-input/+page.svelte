<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)/index.js';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Type in the input and press enter to add tags',
		'Delete tags',
		'Disable everything or disable specific tags',
		'Keyboard navigation',
		'Option to control on:blur -> Do nothing, add tag, clear input',
		'Option to only allow unique tags',
		'Option to enable adding tag on paste',
	];
</script>

<Docs.H1>Tags Input</Docs.H1>
<Docs.Description>Render tags inside an input, followed by an actual text input.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>root:</b> The root container for the tags input</Docs.Li>
	<Docs.Li><b>input:</b> The input textbox for adding new Tags</Docs.Li>
	<Docs.Li><b>tag:</b> A tag element</Docs.Li>
	<Docs.Li><b>deleteTrigger:</b> A button element which deletes a tag</Docs.Li>
	<Docs.Li><b>options:</b> The options store</Docs.Li>
	<Docs.Li><b>tags:</b> The tags store</Docs.Li>
</Docs.Ul>

<!-- Usage -->
<Docs.H2>Usage</Docs.H2>

<Docs.P class="mt-4">
	To create a tags-input, use the <Docs.Code>createTagsInput</Docs.Code> function.
	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>CreateTagsInputArgs</Docs.Code> for available
		arguments
	</Docs.Callout>
	<Docs.CodeBlock code={snippets.usage1} />
</Docs.P>

<Docs.P class="mt-4">
	Then use these values to construct the <Docs.Code>tags-input</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.usage2} />

<!-- Variable definitions -->
<Docs.H2>Variable Definitions</Docs.H2>

<Docs.P class="mt-4">
	The following is an in-depth description of the variables returned from
	<Docs.Code>createTagsInput()</Docs.Code> and how to utilize them.
</Docs.P>

<!-- Options -->
<Docs.H3>Options</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>options</Docs.Code> is a store that can be manipulated programmatically after the builder
	has been created.

	<Docs.P class="mt-4">
		<u>Options</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>placeholder</Docs.Code> - Sets the placeholder value
			<i>(default: 'Enter tags...')</i>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>disabled</Docs.Code> - Global enable/disable <i>(default: false)</i>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>blur</Docs.Code> - What to do on blur <i>(default: nothing)</i>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>unique</Docs.Code> - Only allow unique tags <i>(default: false)</i>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>addOnPaste</Docs.Code> - Add tag on paste <i>(default: false)</i>
		</Docs.Li>
	</Docs.Ul>
</Docs.P>

<!-- Tags -->
<Docs.H3>Tags</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>tags</Docs.Code> is a store that holds an array of objects of type
	<Docs.Code>Tag</Docs.Code>.

	<Docs.P class="mt-4">
		The <Docs.Code>Tag</Docs.Code> object has the keys <Docs.Code>id</Docs.Code> and
		<Docs.Code>value</Docs.Code>.
	</Docs.P>

	<Docs.P class="mt-4">
		As the example demonstrates, use the <Docs.Code>$tags</Docs.Code> store in an
		<Docs.Code>#each</Docs.Code> block to reactively render the tags following changes.
	</Docs.P>

	<Docs.P class="mt-4"
		>This store can be manipulated programmatically to add, delete and edit tags.</Docs.P
	>
</Docs.P>

<!-- Root -->
<Docs.H3>Root</Docs.H3>
<Docs.P class="mt-4">
	The main container.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$root&#125;</Docs.Code> will set and manage.
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>use:root.action</Docs.Code> will set event listeners on this element.
		</Docs.Li>
	</Docs.Ul>

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-focus</Docs.Code> is set when any element within <i>root</i> has focus.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Root</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<!-- Tag -->
<Docs.H3>Tag</Docs.H3>
<Docs.P class="mt-4">
	The container for a tag.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$tag(t)&#125;</Docs.Code> will set and manage attributes.
		</Docs.Li>
	</Docs.Ul>

	When spreading the <Docs.Code>$tag</Docs.Code>, an object containing an
	<Docs.Code>id</Docs.Code> and <Docs.Code>value</Docs.Code> is required. Optionally,
	<Docs.Code>disabled</Docs.Code> can be used to render the tag disabled.

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-selected</Docs.Code> is set when the tag is selected.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true or the tag option
		<Docs.Code>disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Tag</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<!-- Delete Trigger -->
<Docs.H3>Delete Trigger</Docs.H3>
<Docs.P class="mt-4">
	The delete container for a tag.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$deleteTrigger(t)&#125;</Docs.Code> will set and manage attributes.
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>use:deleteTrigger.action</Docs.Code> will set a click event listener, providing the
			ability to delete the given tag.
		</Docs.Li>
	</Docs.Ul>

	When spreading the <Docs.Code>$deleteTrigger</Docs.Code>, an object containing an
	<Docs.Code>id</Docs.Code> and <Docs.Code>value</Docs.Code> is required. Optionally,
	<Docs.Code>disabled</Docs.Code> can be used to render the delete trigger disabled.

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-selected</Docs.Code> is set when the tag is selected.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true or the deleteTrigger option
		<Docs.Code>disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Delete Trigger</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<Docs.H3>Input</Docs.H3>
<Docs.P class="mt-4">
	The input textarea.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$input&#125;</Docs.Code> will set and manage.
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>use:input.action</Docs.Code> will set event listeners on this element.
		</Docs.Li>
	</Docs.Ul>

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-focus</Docs.Code> is set when this element has focus.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Input</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.tag} />
<Docs.API schema={schemas.deleteTrigger} />
<Docs.API schema={schemas.keyboard} />
