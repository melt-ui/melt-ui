# @melt-ui/svelte

## 0.61.3

### Patch Changes

- Dialog: closes #452 ([`f2e4fdbf`](https://github.com/melt-ui/melt-ui/commit/f2e4fdbf347f5b3249823cd2792173cfbea3a130))

- Slider: improve scroll handling (closes #74) ([`6a23b0a1`](https://github.com/melt-ui/melt-ui/commit/6a23b0a1dce9dcd47fff700b749c0601534c92f6))

- Popover: fix page jump in Safari (closes #198) ([`5e30e42f`](https://github.com/melt-ui/melt-ui/commit/5e30e42fe34825da7655b681095d87dbafc3a3ff))

## 0.61.2

### Patch Changes

- Fix: Key events in Select don't work in Safari ([#741](https://github.com/melt-ui/melt-ui/pull/741))

- fix: space to select select options ([#730](https://github.com/melt-ui/melt-ui/pull/730))

- fix: Select - toggle when elements within trigger are clicked ([#735](https://github.com/melt-ui/melt-ui/pull/735))

## 0.61.1

### Patch Changes

- Fix: Days of week not updating with locale ([#722](https://github.com/melt-ui/melt-ui/pull/722))

## 0.61.0

### Minor Changes

- - New Builders: ([#527](https://github.com/melt-ui/melt-ui/pull/527))
    - Calendar - build customizable, accessible, and powerful calendar components
    - Date Field - an enhanced alternative to the native <input type="date" /> with an emphasis on localization & accessibility
    - Date Picker - a combination of the Calendar, Date Field, & Popover builders
    - Range Calendar - build a calendar with range selection. Extends the power & functionality of the Calendar
    - Date Range Field - an enhanced alternative to using two native <input type="date" /> inputs for selecting start and end dates, with an emphasis on localization & accessibility
    - Date Range Picker - a combination of the Range Calendar, Date Range Field, & Popover builders

## 0.60.2

### Patch Changes

- Fix: Menubar Menu bring your own id ([#716](https://github.com/melt-ui/melt-ui/pull/716))

## 0.60.1

### Patch Changes

- Fix: Dialog layout shift when using svelte transitions ([#706](https://github.com/melt-ui/melt-ui/pull/706))

## 0.60.0

### Minor Changes

- TOC: isActive helper ([`c7618563`](https://github.com/melt-ui/melt-ui/commit/c7618563bcc836bd3bd14800cb1f1b964b1e0834))

## 0.59.1

### Patch Changes

- Fix: prevent safari from minimizing when esc on dialogs ([#705](https://github.com/melt-ui/melt-ui/pull/705))

- fix: context menu id issues ([#707](https://github.com/melt-ui/melt-ui/pull/707))

## 0.59.0

### Minor Changes

- TOC: 'all-parents' type ([`67307b2a`](https://github.com/melt-ui/melt-ui/commit/67307b2a64fae896bc6b3238f1477ad9e14fd40c))

## 0.58.2

### Patch Changes

- fix: timing issue with `handleFocus` ([#693](https://github.com/melt-ui/melt-ui/pull/693))

## 0.58.1

### Patch Changes

- Slider: fix overstep ([#659](https://github.com/melt-ui/melt-ui/pull/659))

- Slider: fix precision issues ([`cbe8c3a4`](https://github.com/melt-ui/melt-ui/commit/cbe8c3a44221f38506175e84ab9915da0a1cf84c))

## 0.58.0

### Minor Changes

- Feat: ability to override internal ids via a prop ([#683](https://github.com/melt-ui/melt-ui/pull/683))

## 0.57.3

### Patch Changes

- Dialog: improve trigger focus' ([`257deb36`](https://github.com/melt-ui/melt-ui/commit/257deb363b3614ee0aa5c11822f3e42d577d6466))

## 0.57.2

### Patch Changes

- Menu: add controlled submenu props ([#676](https://github.com/melt-ui/melt-ui/pull/676))
  Listbox: Respect `closeOnEscape`

## 0.57.1

### Patch Changes

- Menus: Return Ids ([#674](https://github.com/melt-ui/melt-ui/pull/674))

## 0.57.0

### Minor Changes

- Combobox & Select: `highlightOnHover` option ([#671](https://github.com/melt-ui/melt-ui/pull/671))

## 0.56.0

### Minor Changes

- Add `openFocus` & `closeFocus` props for controlled focus ([#663](https://github.com/melt-ui/melt-ui/pull/663))

## 0.55.4

### Patch Changes

- Fix bug where context menu wasn't treating elements within the trigger as part of the trigger ([#654](https://github.com/melt-ui/melt-ui/pull/654))

- fix: loop prop in menus ([#643](https://github.com/melt-ui/melt-ui/pull/643))

- DropdownMenu: Implement `disableTriggerRefocus` prop ([#647](https://github.com/melt-ui/melt-ui/pull/647))

- Tooltip: Avoid calling openTooltip on every mousemove, fixing a couple of bugs: ([#660](https://github.com/melt-ui/melt-ui/pull/660))

  - onOpenChange was being called for every mouse move within the tooltip.
  - Overlapping grace areas were fighting over the group.

- - Apply correct aria attributes depending on `type` of toolbar group ([#644](https://github.com/melt-ui/melt-ui/pull/644))

- - Apply correct aria attribute depending on `type` of toggle group ([#645](https://github.com/melt-ui/melt-ui/pull/645))

## 0.55.3

### Patch Changes

- Combobox: allow contenteditable ([#633](https://github.com/melt-ui/melt-ui/pull/633))

## 0.55.2

### Patch Changes

- Dialog: Fix touch event passing through overlay ([`9bf81b3b`](https://github.com/melt-ui/melt-ui/commit/9bf81b3bfbbdb7cc870bd71332e7afc6d6c54fbb))

## 0.55.1

### Patch Changes

- The `melt` action now throws a helpful error if it's used without our [preprocessor](https://github.com/melt-ui/preprocessor) ([#616](https://github.com/melt-ui/melt-ui/pull/616))

## 0.55.0

### Minor Changes

- Select: use listbox builder ([#613](https://github.com/melt-ui/melt-ui/pull/613))

- Combobox: Use listbox builder ([#613](https://github.com/melt-ui/melt-ui/pull/613))

- Add new internal builder `listbox` ([#613](https://github.com/melt-ui/melt-ui/pull/613))

## 0.54.1

### Patch Changes

- Combobox: fix highlightedItem behaviour ([`36d7526c`](https://github.com/melt-ui/melt-ui/commit/36d7526c9b414a6eb8bc6ccb5499eb3665d2a213))

## 0.54.0

### Minor Changes

- Combobox: add hiddenInput element; refactor behaviours ([`a73b82c6`](https://github.com/melt-ui/melt-ui/commit/a73b82c68e83f31f092d010eb749d41a051f7432))

### Patch Changes

- Select: rename `input` to `hiddenInput` ([`4c53736c`](https://github.com/melt-ui/melt-ui/commit/4c53736c8c26e65dc3e8c709e7383bb7fff440aa))

## 0.53.0

### Minor Changes

- Feat: Allow opting-out of floating UI ([`1614f12c`](https://github.com/melt-ui/melt-ui/commit/1614f12c5e09cdce8c0e19a94d4e52b8e591626f))

## 0.52.0

### Minor Changes

- return an `ids` object from builders which contains the `id`s Melt applies to certain elements internally ([#591](https://github.com/melt-ui/melt-ui/pull/591))

### Patch Changes

- Tooltip: Fix bug with `group` parameter ([#590](https://github.com/melt-ui/melt-ui/pull/590))

- Link Preview: Fix bug where content would not close ([`c882dfa5`](https://github.com/melt-ui/melt-ui/commit/c882dfa52f1f2005bf1afe7e345c83dffb9daf36))

- Slider: Add `aria-disabled` to root ([#584](https://github.com/melt-ui/melt-ui/pull/584))

- Tooltip: fix esc handler ([`178ef63e`](https://github.com/melt-ui/melt-ui/commit/178ef63ebc0e1382aa2bb2896a55d8345eb1e852))

## 0.51.1

### Patch Changes

- Select: Fix defaultSelected clash when `multiple` is true ([`d0a1d4c8`](https://github.com/melt-ui/melt-ui/commit/d0a1d4c8514ca298b082f9ff62fe46b52d5d45ad))

- Combobox: Fix defaultSelected clash when `multiple` is true ([`633bacf0`](https://github.com/melt-ui/melt-ui/commit/633bacf062b1affcab92f4148ae4609a1532e747))

## 0.51.0

### Minor Changes

- Tooltip: Add `group` prop ([#575](https://github.com/melt-ui/melt-ui/pull/575))

### Patch Changes

- Combobox: Fixed focus management (#569) ([#570](https://github.com/melt-ui/melt-ui/pull/570))

- fix: change JSDoc example for `melt` action ([#576](https://github.com/melt-ui/melt-ui/pull/576))

- Tooltip: rework open & close behaviours ([`21bcf3d0`](https://github.com/melt-ui/melt-ui/commit/21bcf3d003af2e4d2fe0f066e6b2b255fc797629))

- fix: add generics to exported types ([#579](https://github.com/melt-ui/melt-ui/pull/579))

## 0.50.1

### Patch Changes

- Select: Fix `selected` prop type ([#539](https://github.com/melt-ui/melt-ui/pull/539))

- Pin Input: bind `$valueStr` store to `hiddenInput` of `pin-input` builder ([#557](https://github.com/melt-ui/melt-ui/pull/557))

- Combobox: Fix exported types ([`9e4c6a26`](https://github.com/melt-ui/melt-ui/commit/9e4c6a26b8623d4cb33fd939b80a140e15597cc1))

- Dropdown Menu: Up key focuses last menu item if there is no selection ([#550](https://github.com/melt-ui/melt-ui/pull/550))

- Pin Input: Change `type` prop's types (that's confusing!) ([#545](https://github.com/melt-ui/melt-ui/pull/545))

## 0.50.0

### Minor Changes

- Combobox: Add multiple option ([#533](https://github.com/melt-ui/melt-ui/pull/533))

- Slider: add ticks ([#534](https://github.com/melt-ui/melt-ui/pull/534))

### Patch Changes

- Select: fix deep equality on isSelected ([`ad02e18f`](https://github.com/melt-ui/melt-ui/commit/ad02e18f2029d573c2b99ee95dce46a9ddeb6e35))

## 0.49.1

### Patch Changes

- ca04a433: Combobox: Pressing enter no longer submits form

## 0.49.0

### Minor Changes

- 4da1aa73: Combobox: Refactor API, allowing for a more general use case.
  - Discarded `isEmpty`, `filterFunction` & `debounce`.
  - Added `touchedInput` state

## 0.48.0

### Minor Changes

- 82d37a43: Tooltip: Add `disableHoverableContent` prop

### Patch Changes

- c472cf1d: chore(package.json): add 'repository' property to `package.json`
- 244aae3f: refactor: ensure type safety for `disabled` & `data-disabled` props

## 0.47.6

### Patch Changes

- f30c4d17: improve accordion types

## 0.47.5

### Patch Changes

- 952396b2: Tree: remove stopPropagation

## 0.47.4

### Patch Changes

- da5eed08: Tree: improve arrow key performance

## 0.47.3

### Patch Changes

- bb3349ec: Tree: fix initial tabindex

## 0.47.2

### Patch Changes

- e5f48244: Tree: refactor tabindex behaviour

## 0.47.1

### Patch Changes

- 1e3bb94d: Tree: fix arrow key nav

## 0.47.0

### Minor Changes

- ae88900e: Tree: invert logic from collapsed to expanded

### Patch Changes

- 4dcacd19: Tree: mark args as optional

## 0.46.0

### Minor Changes

- 38fd632f: Tree: remove value prop

## 0.45.1

### Patch Changes

- e8ca932a: Refactor: remove leftover logs

## 0.45.0

### Minor Changes

- 5ef61385: Tree: remove label

## 0.44.0

### Minor Changes

- 2c07edcb: ✨ [New builder] Tree View

## 0.43.0

### Minor Changes

- 0f00ca50: Adds highlighted store and isHighlighted helper to combobox
- 5a35ad18: add mutation observer to ToC to make it update when headings change and also return the original heading node within the headings list

### Patch Changes

- 9e15ccd4: Select: fix isSelected function for single option.
- 4991c06d: - Improve handling of custom labels/IDs for select & combo

## 0.42.0

### Minor Changes

- 4aa5ee70: Toasts: updateToast helper fn && null closeDelay option

### Patch Changes

- 113776fa: internal refactors
- a53aa213: Fix: bug preventing menubar triggers from toggling

## 0.41.3

### Patch Changes

- 5d41f209: Popover: fix edge-case where multiple menus were appearing on click

## 0.41.2

### Patch Changes

- d92db5aa: fix derivedWithUnsubscribe not properly unsubscribing

## 0.41.1

### Patch Changes

- 37afdfc8: set package json entry point

## 0.41.0

### Minor Changes

- e6fbcbce: Combobox: change inputValue to Writable

### Patch Changes

- f74ec13d: fix context-menu and menubar typeahead

## 0.40.0

### Minor Changes

- 0528b0e1: Dropdown Menu: Add option to enable or disable typeahead

## 0.39.5

### Patch Changes

- 6f2063e6: fix slider overrideable

## 0.39.4

### Patch Changes

- 2c9ef167: fix: Combobox isSelected function

## 0.39.3

### Patch Changes

- 350246dd: Fix: Bug where selecitng an item in a `Select` would close it's parent popover or dialog

## 0.39.2

### Patch Changes

- aae6d6e2: Expose isInputValid, addTag, etc to helpers in tags-input

## 0.39.1

### Patch Changes

- ff0e0316: Select: fix isSelected

## 0.39.0

### Minor Changes

- d15008fd: Combobox: combine value and label into single selected state
- 85254927: Select: combine value and label into single selected state

### Patch Changes

- b3637384: fix tooltip timers

## 0.38.1

### Patch Changes

- 25118ed8: - Fix bug in `Select` where it would intercept form submissions
- ede9de82: Internal: Swap custom deepEqual fn with `deep-equal` package
- d790d32c: Tag Input: Add JSDoc to `add`, `update` and `remove` functions

## 0.38.0

### Minor Changes

- eedcbb92: Change radio-group item-inputs to single hidden-input

### Patch Changes

- 0de31f18: remove slider default aria lavel
- 7f4aa574: fix dialog content click closing
- eedcbb92: Fix required attribute in radio-group

## 0.37.6

### Patch Changes

- f56e9309: fix(#419) preserve body padding in removeScroll
- 8355263b: fix: bug where dialog would call `handleClose` twice on click outside events

## 0.37.5

### Patch Changes

- 8a6cdd76: fix accordion defaultValue

## 0.37.4

### Patch Changes

- 41db52bf: fix missing tabindex on radio-group
- afe293bd: fix popover click outside & nested popovers

## 0.37.3

### Patch Changes

- 2579257b: fix combobox arrow keys

## 0.37.2

### Patch Changes

- b10b2906: refactor menubar internals

## 0.37.1

### Patch Changes

- c560cd5b: [Menubar] Hotfix: menubar race conditions

## 0.37.0

### Minor Changes

- 77a39a59: fix pin input controlled value
- 908f68ef: Rename Hover Card to Link Preview

### Patch Changes

- 4d9212fc: Keep Select menu open on select when `multiple` prop is `true`
- abcae57d: fix: context menu not closing when clicking on svg element
- 698a22d6: fix combobox controlled reset

## 0.36.0

### Minor Changes

- 886ea40b: improve event canceling; replace e.detail.cancel() with e.preventDefault()

## 0.35.1

### Patch Changes

- 7ab57673: fix accordion defaultValue

## 0.35.0

### Minor Changes

- a5270d8d: Combobox: refactor API to be more declarative

### Patch Changes

- 9fe1832f: Select: improve valueLabel behaviour

## 0.34.6

### Patch Changes

- 13d4cd85: [Context Menu] Fix bug preventing forms from being submitted within the menus
- 0be3520a: [Select] Prevent trigger refocus when using mouse
- 19942427: [Menubar] Fix lag when switching between menus

## 0.34.5

### Patch Changes

- 69858eaf: Resolves a bug in select builder when multi-select is active where data-selected and aria-selected were not being set properly
- aba59d25: fix: tag being created/updated even if not valid

## 0.34.4

### Patch Changes

- c0c66f0d: [Types] Expose ComponentEvent types

## 0.34.3

### Patch Changes

- adcf8853: Improved pin-input backspace behaviour

## 0.34.2

### Patch Changes

- b3756704: remove TOC logs
- dbf938bd: change checkbox default value

## 0.34.1

### Patch Changes

- 8a673d15: remove preventDefault from radio button item

## 0.34.0

### Minor Changes

- 822a0a55: Add TOC

### Patch Changes

- e46d57c8: feature: Add trim option to input-tags

## 0.33.1

### Patch Changes

- 7fd917c1: change tabs autoSet behaviour
- 2ca365c0: - Add `group` and `groupLabel` elements to the Menu builders

## 0.33.0

### Minor Changes

- 5ba01f80: feat: Added support for `NodeNext` and `Bundler` for `tsconfig.json`'s `moduleResolution` config option

## 0.32.2

### Patch Changes

- fbfef15b: Slider: defaultValue no longer required
- 8cc15888: refactor: standardize portal prop

## 0.32.1

### Patch Changes

- 270c98e5: fix: outside click not being allowed on dialog

## 0.32.0

### Minor Changes

- b1bfc1a3: - Toast
  - Change pointerenter behaviour from reset timer to pause timer
  - Add getPercentage function to calculate percentage of time remaining

### Patch Changes

- 6e4b44e7: refactor: menu types

## 0.31.3

### Patch Changes

- 2e29832f: [Combobox] Fix type generation issue

## 0.31.2

### Patch Changes

- 14bbbef4: Fix portalling issues

## 0.31.1

### Patch Changes

- f5bd0768: fix various slider bugs
- 21d19c31: [Dialog] fix: no longer require trigger to open dialog
- b2d33548: refactor: internal menu types

## 0.31.0

### Minor Changes

- cba5bb7c: convert controllable returned states from readables to writables
- 714f4b3c: Combobox: add controlled support

## 0.30.1

### Patch Changes

- 98e05474: fix: Select & Menu keydowns leaking

## 0.30.0

### Minor Changes

- 8218662d: [Select]: Add multiple prop

### Patch Changes

- c2bca81c: [Slider] - Fix vertical slider arrow behavior
- 3b86f0eb: change accordion type prop to multiple

## 0.29.0 - The Big Bad

[Release Notes](https://github.com/melt-ui/melt-ui/blob/develop/RELEASE_NOTES/the-big-bad.md)

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
