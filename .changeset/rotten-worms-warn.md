---
"@melt-ui/svelte": patch
---

Tooltip: Avoid calling openTooltip on every mousemove, fixing a couple of bugs:
- onOpenChange was being called for every mouse move within the tooltip.
- Overlapping grace areas were fighting over the group.

