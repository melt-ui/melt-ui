<script lang="ts">
	import { Docs } from '$routes/(components)';
</script>

<Docs.H2>Anatomy</Docs.H2>

<u>Stores</u>
<Docs.Ul>
	<Docs.Li><b>options:</b> Current options</Docs.Li>
	<Docs.Li><b>tags:</b> Array of added tags</Docs.Li>
	<Docs.Li><b>selected:</b> Selected tag, if there is one</Docs.Li>
	<Docs.Li><b>value:</b> Current value of the input container</Docs.Li>
	<Docs.Li><b>invalid:</b> True when a tag to be added is invalid</Docs.Li>
</Docs.Ul>

<u>Containers</u>
<Docs.Ul>
	<Docs.Li><b>root:</b> The root container for the tags input</Docs.Li>
	<Docs.Li><b>tag:</b> A tag element</Docs.Li>
	<Docs.Li><b>deleteTrigger:</b> A button element which deletes a tag</Docs.Li>
	<Docs.Li><b>input:</b> The input textbox for adding new Tags</Docs.Li>
</Docs.Ul>

<u>Helpers</u>
<Docs.Ul>
	<Docs.Li><b>isSelected:</b> Returns true if a tag is selected</Docs.Li>
</Docs.Ul>
