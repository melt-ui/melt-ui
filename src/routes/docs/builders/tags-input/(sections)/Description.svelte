<script lang="ts">
	import { Docs } from '$routes/(components)';
</script>

<Docs.H2>Builder Description</Docs.H2>

<Docs.P class="mt-4">
	The following is an in-depth description of the return values from
	<Docs.Code>createTagsInput()</Docs.Code>.
</Docs.P>

<Docs.H3><u>Stores</u></Docs.H3>
<Docs.H4>options</Docs.H4>
<Docs.P class="mt-4">
	<Docs.Code>options</Docs.Code> is a store. This store can be updated programmatically at any point
	during the lifecycle of the component.

	<Docs.P class="mt-4">
		Example: <Docs.Code>options.set(&#123...$options, disabled: true&#125)</Docs.Code>
	</Docs.P>

	<Docs.P class="mt-4">
		<u>Options</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>placeholder</Docs.Code>: The input component placeholder
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> 'Enter tags...'</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>disabled</Docs.Code>: Global enable/disable
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> false</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>blur</Docs.Code>: What to do on blur (if the input component has a value)
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> 'nothing'</Docs.Li>
				<Docs.Li class="mt-0"><i>allowed:</i> 'nothing' || 'add' || 'clear'</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>unique</Docs.Code> - Only allow unique tags
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> false</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>addOnPaste</Docs.Code> - Add tag on paste
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> false</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>maxTags</Docs.Code> - Maximum number of tags. <Docs.Code>undefined</Docs.Code> ||
			<Docs.Code>&lt= 0</Docs.Code> means unlimited tags
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> -</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>allowedTags</Docs.Code> - A string array of allowed tags
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> []</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>deniedTags</Docs.Code> - A string array of denied tags. Deny precedence over allow
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> []</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>validator</Docs.Code> - A custom validator function. A return of true means the validator
			passed and the tag may be added
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> -</Docs.Li>
				<Docs.Li class="mt-0">
					<i>Definition:</i>
					<Docs.Code>(tag: string) =&gt boolean</Docs.Code>
				</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>add</Docs.Code> - An asynchronous function to be called after validation but before
			adding the tag to the <Docs.Code>$tags</Docs.Code> store.
			<Docs.Ul class="mt-1.5 mb-1.5">
				<Docs.Li class="mt-0"><i>default:</i> -</Docs.Li>
				<Docs.Li class="mt-0">
					<i>Definition:</i>
					<Docs.Code>(tag: string) =&gt Promise&ltTag | string&gt</Docs.Code>
				</Docs.Li>
			</Docs.Ul>
		</Docs.Li>
	</Docs.Ul>
</Docs.P>

<Docs.H3>tags</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>tags</Docs.Code> is a store which holds an object array of type
	<Docs.Code>Tag</Docs.Code>. Each <Docs.Code>Tag</Docs.Code> consists of an
	<Docs.Code>id</Docs.Code> and <Docs.Code>value</Docs.Code>.

	<Docs.P class="mt-4">
		Tags can be rendered reactively by using this store in an <Docs.Code>#each</Docs.Code> block. For
		example, <Docs.Code>&#123#each $tags as t&#125</Docs.Code>
	</Docs.P>

	<Docs.P class="mt-4">
		This store can be updated programmatically at any point during the lifecycle of the component.
	</Docs.P>
</Docs.P>

<Docs.H3>value</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>value</Docs.Code> is a readable store which holds the current input value.
</Docs.P>

<Docs.H3>selectedTag</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>selectedTag</Docs.Code> is a store which holds the selected
	<Docs.Code>Tag</Docs.Code> if a one is selected. This store can be updated programmatically at any
	point during the lifecycle of the component.

	<Docs.P class="mt-4">
		A <Docs.Code>Tag</Docs.Code> consists of an <Docs.Code>id</Docs.Code> and
		<Docs.Code>Value</Docs.Code>.
	</Docs.P>
</Docs.P>

<Docs.H3>invalid</Docs.H3>
<Docs.P class="mt-4">
	<Docs.Code>invalid</Docs.Code> is a readable store. It's value will be <Docs.Code>true</Docs.Code>
	when a tag to add is invalid. Monitoring this store will enable additional action, such as rendering
	a tooltip.

	<Docs.P class="mt-4">
		This store is an addendum to the <Docs.Code>data-invalid</Docs.Code> attribute.
	</Docs.P>

	<Docs.P class="mt-4">
		The validity of a tag is checked on <Docs.Kbd>Enter</Docs.Kbd>. An invalid stated is cleared
		when the input changes.
	</Docs.P>

	<Docs.P class="mt-4">
		The validity check include, but is not limited to, whether a tag is unique, if a tag exists in
		the allowed listed, or denied listed, whether the maximum number of tags allowed has been
		reached.
	</Docs.P>

	<Docs.P class="mt-4">
		In addition, a custom <Docs.Code>validator</Docs.Code> function can be used, opening the door to
		custom validation, for example a regex check.
	</Docs.P>
</Docs.P>

<Docs.H3><u>Containers</u></Docs.H3>

<Docs.H4>root</Docs.H4>
<Docs.P class="mt-4">
	This is main container, for example, a <Docs.Code>&lt;div&gt</Docs.Code>

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$root&#125;</Docs.Code> will set and manage attributes on this container.
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>use:root.action</Docs.Code> will set event listeners on this container.
		</Docs.Li>
	</Docs.Ul>

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-focus</Docs.Code> is set when any element within <i>root</i> has focus.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-invalid</Docs.Code> is set following the attempted add of a tag that is deemed invalid.
		This may be the case if, for example, <Docs.Code>$options.unique</Docs.Code> is enabled and the
		<Docs.Code>value</Docs.Code> already exists or the <Docs.Code>value</Docs.Code> is not in
		<Docs.Code>$options.allowedTags</Docs.Code>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Root</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<Docs.H4>tag</Docs.H4>
<Docs.P class="mt-4">
	A single tag container, for example, a <Docs.Code>&lt;div&gt</Docs.Code>. This container should
	render the tag value and (optionally) a button to delete the tag.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$tag(t)&#125;</Docs.Code> will set and manage attributes on this container.
		</Docs.Li>
	</Docs.Ul>

	When spreading the <Docs.Code>$tag</Docs.Code>, an object containing an
	<Docs.Code>id</Docs.Code> and <Docs.Code>value</Docs.Code> is required. Optionally,
	<Docs.Code>disabled</Docs.Code> can be passed in to the component disabled.

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-selected</Docs.Code> is set when the tag is selected. This is an alternative to
		<Docs.Code>$selectedTag</Docs.Code>.
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

<Docs.H4>deleteTrigger</Docs.H4>
<Docs.P class="mt-4">
	The delete container of type <Docs.Code>&lt;button&gt</Docs.Code>.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$deleteTrigger(t)&#125;</Docs.Code> will set and manage attributes on this
			container.
		</Docs.Li>
		<Docs.Li>
			<Docs.Code>use:deleteTrigger.action</Docs.Code> will set a click event listener, providing the
			ability to delete the given tag.
		</Docs.Li>
	</Docs.Ul>

	When spreading the <Docs.Code>$deleteTrigger</Docs.Code>, an object containing an
	<Docs.Code>id</Docs.Code> and <Docs.Code>value</Docs.Code> is required. Optionally,
	<Docs.Code>disabled</Docs.Code> can be passed in to the component disabled.

	<Docs.P class="mt-4">
		<u>Notable Attributes</u>
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>data-selected</Docs.Code> is set when the tag is selected. his is an alternative to
		<Docs.Code>$selectedTag</Docs.Code>.
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

<Docs.H4>input</Docs.H4>
<Docs.P class="mt-4">
	The input container of type <Docs.Code>&lt;input&gt</Docs.Code>.

	<Docs.P class="mt-4">
		<u>Parts</u>
	</Docs.P>

	<Docs.Ul>
		<Docs.Li>
			<Docs.Code>&#123;...$input&#125;</Docs.Code> will set and manage attributes on this container.
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
		<Docs.Code>data-invalid</Docs.Code> is set following the attempted add of a tag if the tag is deemed
		invalid. This may be the case if, for example, <Docs.Code>$options.unique</Docs.Code> is enabled
		and the tag has been previously added, or if
		<Docs.Code>$options.allowedTags</Docs.Code> is defined and the tag does not appear in the list.
	</Docs.P>

	<Docs.P class="mt-4">
		<Docs.Code>disabled</Docs.Code> and <Docs.Code>data-disabled</Docs.Code> are set when
		<Docs.Code>$options.disabled</Docs.Code> is true.
	</Docs.P>

	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>Input</Docs.Code> for more.
	</Docs.Callout>
</Docs.P>

<Docs.H3><u>Helpers</u></Docs.H3>
<Docs.H4>isSelected</Docs.H4>
<Docs.P class="mt-4">
	<Docs.Code>isSelected</Docs.Code> is a helper store that is used to determine if a tag is selected.

	<Docs.P class="mt-4">
		For example: <Docs.Code>$isSelected(t)</Docs.Code>, where <Docs.Code>t</Docs.Code> is of type
		<Docs.Code>Tag</Docs.Code>, which consists of an <Docs.Code>id</Docs.Code> and
		<Docs.Code>value</Docs.Code>.
	</Docs.P>
</Docs.P>
