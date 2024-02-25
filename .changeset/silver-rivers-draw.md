---
'@melt-ui/svelte': patch
---

Fixed bug where on outside interaction in several components (popover, menu, link preview, tooltip, listbox), on component unmount, the content jumps during out transition if content was mounted in an else if block
