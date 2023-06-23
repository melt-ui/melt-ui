<script lang="ts">
	import { Docs } from '$routes/(components)';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Customize positioning of popover',
		'Can be controlled or uncontrolled',
		'Focus is fully managed',
	];
</script>

<Docs.H1>Popover</Docs.H1>
<Docs.Description>Displays rich content in a portal, triggered by a button.</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The trigger for the popover</Docs.Li>
	<Docs.Li
		><b>Content:</b> The content area reviewed when the trigger is clicked.

		<Docs.Ul>
			<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
		</Docs.Ul>
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a popover, use the <Docs.Code>createPopover</Docs.Code> builder function. Follow the anatomy
	or the example above to create your popover.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'CreatePopover',
		description: 'Configuration options for the `createPopover` function.',
		args: [
			{
				label: 'checked',
				type: 'boolean | "indeterminate"',
				default: false,
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
			{
				label: 'required',
				type: 'boolean',
				default: false,
			},
			{
				label: 'name',
				type: 'string',
			},
			{
				label: 'value',
				type: 'string',
			},
		],
	}}
/>

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
		>Accordion WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API
	schema={{
		title: 'Keyboard Interactions',
		description: '',
		keyboardInteractions: [
			{
				key: 'Space',
				description: 'Toggles the popover.',
			},
			{
				key: 'Enter',
				description: 'Toggles the popover.',
			},
			{
				key: 'Tab',
				description:
					'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
			},
			{
				key: 'Shift + Tab',
				description:
					'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
			},
			{
				key: 'Esc',
				description: 'Closes the popover and moves focus to the trigger element.',
			},
		],
	}}
/>
