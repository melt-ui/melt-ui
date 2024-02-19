---
'@melt-ui/svelte': minor
---

BIG REFACTOR: Props have been overhauled. e.g. `defaultValue` and `onValueChange` syntax has been changed. Check [docs](https://melt-ui.com/docs) for more info. (Closes #948)

## Specific builder changes:

### Accordion 
- `value` always is an array of strings now
- Removed `isSelected` helper
