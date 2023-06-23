<script lang="ts">
	import { Docs } from '$routes/(components)';

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
<Docs.API
	schema={{
		title: 'CreateSliderArgs',
		description: 'The object you pass into createSlider. Optional.',
		args: [
			{
				label: 'value',
				type: 'number[]',
				default: '[]',
			},
			{
				label: 'min',
				type: 'number',
				default: 0,
			},
			{
				label: 'max',
				type: 'number',
				default: 100,
			},
			{
				label: 'step',
				type: 'number',
				default: 1,
			},
			{
				label: 'orientation',
				type: "'horizontal' | 'vertical'",
				default: "'horizontal'",
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
		],
	}}
/>

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
		>Slider WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API
	schema={{
		title: 'Keyboard Interactions',
		description: '',
		keyboardInteractions: [
			{
				key: 'ArrowRight',
				description: 'Increments/decrements by the `step` value depending on `orientation`.',
			},
			{
				key: 'ArrowLeft',
				description: 'Increments/decrements by the `step` value depending on `orientation`.',
			},
			{
				key: 'ArrowUp',
				description: 'Increases the value by the `step` amount.',
			},
			{
				key: 'ArrowDown',
				description: 'Decreases the value by the `step` amount.',
			},
			{
				key: 'Home',
				description: 'Sets the value to its minimum',
			},
			{
				key: 'End',
				description: 'Sets the value to its maximum',
			},
		],
	}}
/>

<Docs.Construction />
