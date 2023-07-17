<script lang="ts">
	import type { Orientation } from '$lib/internal/types';
	import { createSeparator } from '..';

	export let orientation: Orientation = 'vertical';

	const {
		elements: { root: vertical },
	} = createSeparator({
		orientation,
	});

	const {
		elements: { root: horizontalSeparator },
	} = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});
</script>

<div>
	<h2>Separator</h2>
	<div melt={$horizontalSeparator} data-testid="horizontal" />
	<div>
		<p>Part 1</p>
		<div melt={$vertical} data-testid="vertical" />
		<p>Part 2</p>
	</div>
</div>
