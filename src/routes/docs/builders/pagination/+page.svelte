<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)/index.js';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Full keyboard navigation support',
		'Supports a custom number of pages',
		'Display range of visible pages',
		'Supports a custom number of visible pages',
		'Supports a custom number of sibling pages',
	];
</script>

<Docs.H1>Pagination</Docs.H1>
<Docs.Description>
	An interface that allows navigating between pages that contain split entries.
</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root / <code>root</code>:</b> The root container for the pagination component</Docs.Li
	>
	<Docs.Li>
		<b>Previous Button / <code>prevButton</code>:</b> The button which navigates to the previous page
	</Docs.Li>
	<Docs.Li>
		<b>Page Trigger / <code>pageTrigger</code>:</b> The button(s) which navigates to a specific page
	</Docs.Li>
	<Docs.Li>
		<b>Next Button / <code>nextButton</code>:</b> The button which navigates to the next page
	</Docs.Li>
	<Docs.Li>
		<b>Range / <code>range</code>:</b> The range of pages that are visible to the user
	</Docs.Li>
</Docs.Ul>
<Docs.CodeBlock code={snippets.anatomy} />

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a pagination component, use the <Docs.Code>createPagination</Docs.Code> builder function.
	Follow the anatomy or the example above to create your pagination component.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.pageTrigger} />
<Docs.API schema={schemas.nextButton} />
<Docs.API schema={schemas.prevButton} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.a11ymatters.com/pattern/pagination/"
		>a11y Accessible Pagination guidelines</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
