<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas';

	export let data;

	const features = [
		'Automatic & manual control over image rendering',
		'Fallback supports any children elements',
		'Optionally delay fallback rendering to avoid flashes',
	];
</script>

<Docs.H1>Avatar</Docs.H1>
<Docs.Description>An image element with a fallback for representing the user.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Image:</b> The image element that displays the user's profile picture</Docs.Li>
	<Docs.Li><b>Fallback:</b> The fallback element that displays if the image fails to load</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
