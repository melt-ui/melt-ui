---
'@melt-ui/svelte': minor
---

BIG REFACTOR: Props have been overhauled. e.g. `defaultValue` and `onValueChange` syntax has been changed. Check [docs](https://melt-ui.com/docs) for more info. (Closes #948)

## Specific builder changes

All builders have been modified to use the new prop syntax. However, some specific builders have overgone specific changes, some due to this refactor, and others due to consistency and usability improvements.

### Accordion 
- `value` always is an array of strings now
- Removed `isSelected` helper

### Toggle Group
- `value` always is an array of strings now
- Removed `isPressed` helper

## Table of Contents
- Return `options` stores
- Refactor internals to be reactive according to reactive `options` and `props`