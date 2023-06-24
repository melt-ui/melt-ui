<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Supports multiple thumbs',
		'Can be controlled or uncontrolled',
		'Supports a minimum value between thumbs',
		'Supports both touch and click',
		'Supports a custom step size',
		'Can be vertical or horizontal',
	];
</script>

<Docs.H1>Slider</Docs.H1>
<Docs.Description>
	An input where the user selects a value from within a given range
</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a slider, use the <Docs.Code>createSlider</Docs.Code> builder function. Follow the anatomy
	or the example above to create your slider.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.slider} />
<Docs.API schema={schemas.thumb} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
		>Slider WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
