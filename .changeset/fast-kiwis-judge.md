---
"@melt-ui/svelte": minor
---

fix/refactor [toolbar]

### BREAKING CHANGE:

`createToolbarGroup` is no longer a separate import, it is returned from the `createToolbar` builder function. This is not only a cleaner approach, but also enables us to scope the context of the groups to a given toolbar.

```diff
<script lang="ts">
  import {
    createToolbar,
-   createToolbarGroup
} from '@melt-ui/svelte';

	import { Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight } from 'icons';

	const { root, options, button, link, separator } = createToolbar();
	const { root: fontGroup, item: fontItem } = createToolbarGroup({
-		toolbarOptions: options,
		type: 'multiple',
	});
	const { root: alignGroup, item: alignItem } = createToolbarGroup(
-  { toolbarOptions: options }
  );
</script>
``` 
