<script lang="ts">
	import { createSeparator } from '$lib';
  import type { Orientation } from '$lib/internal/types';
	import { Docs } from '$routes/(components)';
  
  export let orientation: Orientation = 'vertical';
  
  const { separator: vertical } = createSeparator({
    orientation,
  });
  
  const { separator: horizontalSeparator } = createSeparator({
    orientation: 'horizontal',
    decorative: true,
  });

  const icecreams = [
    'Caramel',
    'Vanilla',
    'Napolitan',
  ]
</script>

<Docs.PreviewWrapper>
  <h2 class="font-bold text-lg">Melt UI</h2>
  <p class="text-sm ">Pick your flavour</p>
  <div {...$horizontalSeparator} class="h-[1px] w-full bg-white my-2" />
  <div class="flex space-x-2 items-center">
    {#each icecreams as icecream, i}
        <p class="text-sm">{icecream}</p>
        {#if i !== icecreams.length - 1}
          <div {...$vertical} class="h-4 w-[1px] bg-white" />
        {/if}
    {/each}
  </div>
</Docs.PreviewWrapper>