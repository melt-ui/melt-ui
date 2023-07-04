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

<Docs.H1>Combobox</Docs.H1>
<Docs.Description>A filterable list of items that supports selection</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li
		><b>Input:</b> The input that opens, closes, filters the list, and displays the selected value from
		the list</Docs.Li
	>
	<Docs.Li><b>List:</b> The popover select list</Docs.Li>
	<Docs.Li><b>Item:</b> The individual list item</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.option} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
		>Autocomplete/Combobox WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
