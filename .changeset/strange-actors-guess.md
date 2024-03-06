---
'@melt-ui/svelte': patch
---

fix(Tooltip, Link Preview, Menu, Popover, Listbox) fixed bug where content jumps to top left of page during external unmounting when using out transition on the content and else if block to render the content (closes #1058, #1039)
