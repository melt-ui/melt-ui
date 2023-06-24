<script lang="ts">
	import type { Orientation } from '$lib/internal/types';
  import { createSeparator } from '..';

  export let orientation: Orientation = 'vertical';

  const { separator: vertical } = createSeparator({
    orientation,
  });

  const { separator: horizontalSeparator } = createSeparator({
    orientation: 'horizontal',
    decorative: true,
  });
</script>

<div>
  <h2>Separator</h2>
  <div {...$horizontalSeparator} data-testid="horizontal" />
  <div>
    <p>Part 1</p>
    <div {...$vertical} data-testid="vertical" />
    <p>Part 2</p>
  </div>
</div>