# v0.29.0 - 'The Big Bad' Released!

After tons of hard work by @huntabyte and @CokaKoala, we're finally releasing our biggest refactor
yet.

The Big Bad Refactor.

https://www.youtube.com/watch?v=OBqw818mQ1E

This comes with a number of changes! Seriously, it's a lot. I wrote a ton of words.

Here it goes!

## 📦 Clearer Builder Return Structure

Before The Big Bad, the builder returned a number of element stores, helpers, actions, and options,
all in the same object. Now, we organized the return structure so it's clearer from the get-go what
each variable does:

```ts
// Before
const { open, root, content, trigger } = createCollapsible()

// After
const {
	elements: { root, content, trigger },
	states: { open }
} = createCollapsible()
```

## 📜 Exported builder types

We love Typescript. We also love simple code. And previously, it was a bit hard to extract the types
of builder stores without being a Typescript Wizard. So we solved the wizardry for you, and are now
exporting a bunch more types for you!

e.g. For `createAccordion`, you now have the Accordion type, which represents the return type of
`createAccordion`. You also have the `AccordionElements` type, `AccordionOptions`,
`AccordionStates`, and so on!

What if you want to access the value of the trigger store for accordion? It's simple really:

```ts
import type { AccordionElements, StoreValue } from '@melt-ui/svelte'

type AccordionTriggerValue = StoreValue<AccordionElements['trigger']>
```

## 🦾 Better controlled usage

We completely revamped how controlled usage worked in various ways.

### Bring your own store

Before, you'd have to wrestle with our returned store to get what you want, now you can simply pass
your own store.

```ts
import { createDialog } from '@melt-ui/svelte'
import { writable } from 'svelte/store'

const customOpen = writable(false)

const {
	elements: { trigger, overlay, content, title, description, close }
} = createDialog({
	open: customOpen
})
```

Any time `customOpen` changes, you'll see that `createDialog` will react to it!

### Change Functions

We also accept "onChange" functions for certain stores, which allow you to control the value of the
store before it's set.

```ts
import { createDialog, type CreateDialogProps } from '@melt-ui/svelte'

const someCondition = false

const handleOpen: CreateDialogProps['onOpenChange'] = ({ curr, next }) => {
	if (!someCondition) {
		return curr
	}
	return next
}

const {
	elements: { trigger, overlay, content, title, description, close }
} = createDialog({
	onOpenChange: handleOpen
})
```

The value returned from the `onChange` function will be the new value of the `open` store. `curr`
represents the current value of open, while `next` represents the value that `open` would assume
next, in case the `onOpenChange` function wasn't provided.

What about what existed before, where passing in a value prop would set the default value?

That's still available:

```ts
const { elements } = createDialog({ defaultOpen: true })
```

### Custom event listeners

Builders listen to a bunch of events in your elements to add functionality. But sometimes, you may
want to prevent some of these behaviors, e.g. disallowing an accordion to open on keydown.

Now, for every event we listen to, we also dispatch a cancellable custom event:

```svelte
<button
	use:melt={$trigger}
	on:m-click={(e) => {
		e.detail.cancel()
		// do something else
	}}>
	Trigger
</button>
```

By cancelling the event, you're in control of what that event listener does. You know what comes
with great power, right?

You can read more about these changes at https://melt-ui.com/docs/controlled

## 🎆 Full transition support

We worked out a ton of bugs with transitions, and provided a new prop for some builders:
forceVisible! When forceVisible is set to true, your elements will never be hidden by default.
You'll be responsible for controlling the visibility of these items, which means you gain a ton of
flexibility over how you want to show your components!

You can read more about these changes at https://melt-ui.com/docs/transitions

## 💧 New PP

Our pre-processor got an update! Previously, the PP reacted to an HTML attribute, `melt`. That came
with a few issues though:

- Inability to use multiple element stores in a single HTML element
- Can't name a component prop melt
- Internally, failure to pass in some custom types (e.g. for the custom events)

To address these issues, the PP now works with an action, also called `melt`` (which needs to be
imported).

```svelte
<button use:melt={$trigger}>Toggle</button>
```

It works virtually the same way the PP did before, but addresses the issues mentioned above!

As always, the docs are here for you: https://melt-ui.com/docs/preprocessor

# :colossal_titan_heart_eyes: Closing notes

You can try out The Big Bad today! Please make sure to update both `@melt-ui/svelte` and
`@melt-ui/pp` to their latest versions.

Please send out a ton of love to @huntabyte and @CokaKoala. This was a huge effort on their part,
and couldn't have been done without them ❤️

And a huge thanks for all the support so far! This library has been skyrocketing beyond my wildest
dreams, and it's all thankful to the vibrant community we're building together.

Happy hacking! :cat_coding:
