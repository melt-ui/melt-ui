---
'@melt-ui/svelte': patch
---

Only mount the portal for dialog, menu overlay, and popover overlay when the component is set to open. This applies when `forceVisible: false` is used.
