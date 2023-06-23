<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';

	export let data;
	const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];
</script>

<Docs.H1>Switch</Docs.H1>
<Docs.Description>
	A control that allows the user to toggle between checked and not checked.
</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the accordion</Docs.Li>
	<Docs.Li><b>Input:</b> The native HTML input that is visually hidden</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a switch, use the <Docs.Code>createSwitch</Docs.Code> builder function. You can then reference
	the anatomy or example above to create your switch.
</Docs.P>

<Docs.H3>Disabling the switch</Docs.H3>
<Docs.P>
	To disable the switch, set the <Docs.Code>disabled</Docs.Code> argument as <Docs.Code
		>true</Docs.Code
	>.
</Docs.P>

<Docs.CodeBlock code={snippets.disable} />

<Docs.H3>Controlled access</Docs.H3>

<Docs.P>
	To programatically control the switch, you can directly set the <Docs.Code>checked</Docs.Code> store.
	You can also update the <Docs.Code>options</Docs.Code> store with new arguments.
</Docs.P>
<Docs.CodeBlock code={snippets.controlled} />

<Docs.H2>API Reference</Docs.H2>

<Docs.API schema={{
    title: 'CreateSwitchArgs',
    description: 'The object you pass into createAccordion. Optional.',
    args: [
        {
            label: 'checked',
            type: "boolean",
            default: "false",
        },
        {
            label: 'disabled',
            type: 'boolean',
            default: "false",
        },
        {
            label: 'required',
            type: 'boolean',
            default: "false"
        },
        {
            label: 'name',
            type: 'string',
        },
        {
            label: 'value',
            type: 'string',
        }
    ],
}} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
		>Switch WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API
	schema={{
		title: 'Keyboard Interactions',
		description: '',
		keyboardInteractions: [
			{
				key: 'Space',
				description: 'When the switch has focus, toggles the switch.',
			},
			{
				key: 'Enter',
				description: 'When the switch has focus, toggles the switch.',
			},
		],
	}}
/>
