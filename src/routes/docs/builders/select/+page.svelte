<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Can be controlled or uncontrolled',
		'Typeahead support',
		'Optional arrow component',
		'Custom positioning',
	];
</script>

<Docs.H1>Select</Docs.H1>
<Docs.Description>
	Displays a list of options for the user to pick from—triggered by a button.
</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The button that opens/closes the select menu</Docs.Li>
	<Docs.Li><b>Menu:</b> The popover select menu</Docs.Li>
	<Docs.Li><b>Option:</b> The individual select options</Docs.Li>
	<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.option} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
		>ListBox WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
