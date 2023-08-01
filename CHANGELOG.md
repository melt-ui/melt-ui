# @melt-ui/svelte

## 0.29.0

### Minor Changes

- f44c54eb: Dialog: Add portalled element

### Patch Changes

- d2d7c98f: Fix: vertical slider inversion

## 0.28.0

### Minor Changes

- 8400a4e5: Replaced the `melt` attribute for the `use:melt` action
- ab1ec0bd: New Feature: Controlled Props
  - Controlled props give you more control over the state & behavior of the builder components.
- 8e5414c8: [New Feature] Custom Melt Events

## 0.28.0-next.0

### Minor Changes

- ab1ec0bd: New Feature: Controlled Props
  - Controlled props give you more control over the state & behavior of the builder components.
- 8e5414c8: [New Feature] Custom Melt Events

## 0.27.3

### Patch Changes

- a3781f7c: fix: Remove `@melt-ui/svelte` alias, add text transform

## 0.27.2

### Patch Changes

- 6f521b22: [Hover Card]
  - Fix bug where the link/button is unclickable on mobile

## 0.27.1

### Patch Changes

- 467a8ff3: Select: fix bug where quick sliding would not set the values to min/max

## 0.27.0

### Minor Changes

- 1afcc4b2: Select: add label el store

### Patch Changes

- 60067d43: Select: fix value controlled usage not setting valueLabel
- 548258cd: Select: rename label to valueLabel
- f94c61ec: Combobox: include for attribute in label

## 0.26.3

### Patch Changes

- 714d8e18: fix: tooltip behaviour

## 0.26.2

### Patch Changes

- 75ba9c3b: fix: tooltip pointerover now only works with mouse inputs

## 0.26.1

### Patch Changes

- 61123724: tooltip: change defaults; improve behaviour consistency

## 0.26.0

### Minor Changes

- 7a8c0f05: Tooltip: Change default options; Add trigger/content gap handling; Behaviour changes

### Patch Changes

- d055b2a5: [Tooltip] Fix a11y attributes & behavior
- c5945220: [Avatar] Fixes bug where the fallback is hidden
- a71ac941: fix: dialog focus-trap
- 2f803ea8: [Combobox]
  - Fix Open/Close Flickering
  - Returns a `label` element builder

## 0.25.1

### Patch Changes

- fix: avatar fallback overriding styles

## 0.25.0

### Minor Changes

- 2d1936b0: feat: tooltip touch support

### Patch Changes

- 902cb5dc: refactor: Internal type-safety & performance changes
- 6f620f0a: fix: clicks misfiring
- 9c81f47e: refactor: rename createToasts to createToaster

## 0.24.1

### Patch Changes

- 0f100296: [Checkbox] Unsub checkbox click event
- afa02ae9: use nanonid/non-secure to support more environments

## 0.24.0

### Minor Changes

- ef32b32a: [New Builder] Toast

### Patch Changes

- f25ed135: [Dialog]: Dialog no longer closes on right-click

## 0.23.2

### Patch Changes

- 3c7725c3: [Tabs] Force focus on click for buttons in safari

## 0.23.1

### Patch Changes

- 55815f04: Slider: invert vertical direction
- 7639d712: Tooltip: prevent focus on mousedown
- b7cfbf13: Select: add a11y roles
- f1e7c64c: Slider: metaKeys to jump to values
- 7d7b18e8: refactor: improved accordion types

## 0.23.0

### Minor Changes

- 893535af: [Accordion]
  - Add missing aria attributes
  - Add `heading` builder to apply aria attributes to non-heading elements used as headings

### Patch Changes

- c987225b: [Combobox]
  - Fix a bug where tabbing from would open it
  - Close the menu when tab/shift+tab is pressed
- de855112: Fix: Type issue with `melt` attribute on certain elements

## 0.22.2

### Patch Changes

- 151fcc35: [Multiple] Fix radio focus & other left click issues
- b731d118: fix: builders not exposing actions

## 0.22.1

### Patch Changes

- 00043ed4: Fixed the `melt` attribute's documentation

## 0.22.0

### Minor Changes

- 434cc977: feat: Adds the PP

## 0.21.0

### Minor Changes

- 053ea4d5: [Select] Support <kbd>Page Up</kbd> and <kbd>Page Down</kbd> keyboard navigation.
  [Combobox] Support <kbd>Page Up</kbd> and <kbd>Page Down</kbd> keyboard navigation.

### Patch Changes

- 94861927: [Menus]
  - Fix lag between submenus and menubar menus
  - Fix the non-chromium browser issue where `data-highlight` would persist after the menu closes and reopens.

## 0.20.0

### Minor Changes

- 87612adb: feat: allow focus trap disabling popover

## 0.19.1

### Patch Changes

- 1386ff64: feat: popover controlled usage
- ad43dedd: [Menus] fix: dropdown submenu not closing
- 8be65692: [Refactor] Args -> Props

## 0.19.0

### Minor Changes

- 476abfc: feat(dialog): support nested dialogs

## 0.18.4

### Patch Changes

- 9a28950: fix(combobox): input blur strange behaviour
- 7accc8b: fix(slider): disabled slider no longer prevents scroll
- 7accc8b: refactor(combobox): improve combobox reset behaviour
- 1966f82: fix(slider): only left-click triggers slider
- 8f98478: [Dropdown Menu] Fix dropdown trigger tabindex issue
- bc8a6da: fix collapsible disabled attribute
- 8df24e5: refactor: disable middle & right clicks on Tabs and Radio Group

## 0.18.3

### Patch Changes

- 9f78da5: [Menus]: Close Menus on Tab press within submenus
- deb46a9: fix(collapsible): disabled state
- 5c80008: [Menus] Fix submenu typeahead logic

## 0.18.2

### Patch Changes

- 4170fc5: Fix tag-input focus
- 0c7008c: fix incomplete builders

## 0.18.1

### Patch Changes

- 068b84a: add action to function builders return

## 0.18.0

### Minor Changes

- 2fda798: feat: pin-input builder
- dbadcbe: export return types for all builders
- 439ab89: Add Combobox builder
- f54f4a5: label as const
- d11eaab: tags input: edit support

### Patch Changes

- 973672e: export builder types
- ec1abfe: Use builder wrapper
- 973672e: export data-melt-[part] on builders

## 0.17.0

### Minor Changes

- 1266ef6: New Feature: Menubar
- 100eb14: [New Builder] Hover Card

### Patch Changes

- d108259: fix(toggle-group): focus selected first

## 0.16.0

### Minor Changes

- d031b34: fix/refactor [toolbar]

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

- b7c9930: feat: Context Menu
- d01a759: Select improvements:
  - Improved Typeahead support for repeated characters to cycle through elements with that same character.
  - Shared typeahead with DropdownMenu & Select
  - Added createGroup builder returned from createSelect to assist with creating accessible option groups.
  - Updated preview/example
  - Add loop option to loop through items

### Patch Changes

- fbb67de: Rework tags-input
- 379e413: [Dropdown/Context Menus] Update tab & scroll behaviors
- 45ac2b1: [Toggle Group]: Fix tab behavior
- 18c36cb: fix[select]: tab navigation

## 0.15.0

### Minor Changes

- 690ad4d: feat: tags input
- 0aa94da: feat: Dropdown Menu

## 0.14.0

### Minor Changes

- ae6ecfe: Feat: Avatar builder
- 0dd1ab0: feat: Separator builder
- 2a88d9d: Feat: Label builder

## 0.13.1

### Patch Changes

- 7a6e9b4: fix isSelected fn
- 03d1cde: revert id change back to nanoid

## 0.13.0

### Minor Changes

- 86a9b3a: feat(select): allow disabling individual options
- 09bb891: refactor: use action builders

### Patch Changes

- 4a5b1a1: fix(select): changing select value store now automatically changes select label store
- 0b4fe38: feat(toggle): allow disabled state to be changed

## 0.12.0

### Minor Changes

- dc17ef5: feat(select): option to set default label; rename selected to value & selectedText to label

### Patch Changes

- a5d6d37: fix: pagination edge cases
- dc17ef5: fix(select): disabled select trigger no longer opens menu

## 0.11.1

### Patch Changes

- 7b07c53: fix: focus trap not working in certain components

## 0.11.0

### Minor Changes

- 3df8740: expose options store in tabs

### Patch Changes

- fb9e489: fix(select): selectedText not being set onMount
- 3df8740: refactor: improve dir detection
- 4d3ab1d: feat: support RTL directions

## 0.10.3

### Patch Changes

- 517b1c1: fix: slider not working properly with low values
- 5ff87f6: fix: focusTrap not unsubbing
- bc51681: fix: Adjusts `typeVerisons` map to fix incorrect auto-imported path

## 0.10.2

### Patch Changes

- 1cf6fb8: fix toolbar exports

## 0.10.1

### Patch Changes

- c0616cc: remove onChange from collapsible
- 600a530: fix slider dragging screen on mobile
- 55754c1: refactor(select): label attr & unknown value
- cefa91e: fix(select): prevent focus on mousedown

## 0.10.0

### Minor Changes

- d3aeed2: add toolbar

### Patch Changes

- eb2afe5: fix slider intercepting document clicks

## 0.9.0

### Minor Changes

- 897a45d: feat: add slider

### Patch Changes

- 9c960cb: refactor: update selectedText to support numbers
- ad4436b: feat: export input el from select
  refactor: change pagination default perPage to 1
- 2d224d1: fix(slider): correct slider value return; steps functionality on mouse drag

## 0.8.3

### Patch Changes

- f63cf06: fix: export pagination

## 0.8.2

### Patch Changes

- 6a370c6: fix dialog scroll lock
- 63d6c02: add selected arg to select; add number support to select
- 63d6c02: improve select focus management

## 0.8.1

### Patch Changes

- 12c9700: fix: prevent default pagination keydown handler

## 0.8.0

### Minor Changes

- 4c481ee: feat: pagination

## 0.7.1

### Patch Changes

- c824aa4: improve scroll lock

## 0.7.0

### Minor Changes

- f9ec447: add tooltip

### Patch Changes

- 62f7413: dialog improvements
- 4e27f95: close tooltip on pointer down functionality

## 0.6.0

### Minor Changes

- f7dc717: change select trigger to be single derived
- 6f98aa5: add dialog

## 0.5.0

### Minor Changes

- fc18981: add select features (typeahead) & refactor internals
- 0f1a1f6: Select: add isSelected and options to returned object; Add HOME and END kbd listeners

### Patch Changes

- cb1b21c: Adjust browser detection function

## 0.4.0

### Minor Changes

- 444f570: feat: popover
- 6fd8efe: update accordion return

### Patch Changes

- 7971876: use popper action on select

## 0.3.0

### Minor Changes

- 1ba6b49: add radio group
- 5c4ed8c: add progress

## 0.2.0

### Minor Changes

- 2377592: add switch
- b685910: add toggle group

## 0.1.0

### Minor Changes

- c4583cb: add toggle builder

## 0.0.2

### Patch Changes

- 2d34b85: Chore: add builder docs
