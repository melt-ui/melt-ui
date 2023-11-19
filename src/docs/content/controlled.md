---
title: Controlled
description: Melt UI components are uncontrolled by default, but offer the ability to be controlled.
---

<script>
    import { Callout } from '$docs/components'
</script>

<Callout type="warning">

Controlled components are an optional advanced feature and should only be used when necessary. If
you're unsure if you should be using the components in a controlled way, you likely don't need to.

</Callout>

## Controlled vs. Uncontrolled

There are various definitions for controlled/uncontrolled components, but in the context of Melt UI,
uncontrolled means that the state and stores of a component are created and managed automatically.
Controlled means that the user (you) can create and manage the state and stores.

All components are uncontrolled by default, and in most cases, this is more than enough. However,
our goal is to provide as much flexibility as possible, so we offer a few ways to give you more
control over the state and behavior of the components.

<Callout>

For the following examples, we'll use the `Dialog` builder, but the same concepts also apply to
other builders. Be sure to checkout the builder's API reference to see what controlled options are
available.

</Callout>

## Modify Writable States

By default, we provide an `open` store from the `Dialog` builder that will have its state updated
whenever a `trigger` or `close` element is pressed.

You can update the `open` store that's returned at any moment, even without expecting an user
interaction.

```svelte {10}
<script lang="ts">
	import { createDialog } from '@melt-ui/svelte'
	import { writable } from 'svelte/store'

	const {
		elements: { trigger, overlay, content, title, description, close },
		states: { open }
	} = createDialog()

	open.set(true)
</script>
```

## Bring Your Own Store

If you wanted to define your own `open` store so that its state could be shared and updated by other
parts of your app, then we offer a way for you to supply your own.

It's as simple as passing your own `open` store to the `createDialog` builder.

```svelte {5, 10}
<script lang="ts">
	import { createDialog } from '@melt-ui/svelte'
	import { writable } from 'svelte/store'

	const customOpen = writable(false)

	const {
		elements: { trigger, overlay, content, title, description, close }
	} = createDialog({
		open: customOpen
	})
</script>
```

Behind the scenes, we're using the custom `open` store you passed in instead of creating our own.
Which means your store will be updated as the default `open` store normally would, but you'll be
able to create it and share it with other parts of your app before initializing the Dialog.

Also note that we still return an `open` store on the `states` object. It uses the same custom store
you pass in though, so modifying it will modify your custom store as well.

<Callout type="warning">

We can't guarantee that everything will work as expected if you choose to modify certain state
stores outside of the builder, so use this feature with caution. These controls are provided to
cover those edge cases where you want to do something that the library won't support out of the box.

</Callout>

## Change Functions

A _change function_ is called when the value of a `state` store would normally change. It receives
an object with `curr` and `next` properties, whose values are the current and next values of the
store.

The `next` value is what the store would have been set to by default if the change function wasn't
used. The `curr` value is the current value of the store.

Whatever is returned from the change function will be used as the new value of the store.

The snippet below shows an example of how the change function could be used to prevent the `open`
store from being set to `true` based on some arbitrary condition.

```svelte {6-11,16}
<script lang="ts">
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
</script>
```

Of course, this is a contrived example, but it nicely demonstrates the power of this feature.

## Custom Events

Melt automatically attaches listeners for and handles events for various elements to provide
functionality. However, there may be times where you disagree with a particular way we handle the
event, or you just want to add some extra functionality on top of what we provide.

For each event that we listen to and handle, we also provide a way for you to override the default
behavior, or add your own in addition to ours. The custom event that we dispatch is always prefixed
with `m-` and what follows is the name of the original event.

For example, if we're listening to and handling a `click` event on a `trigger` element, then we'll
dispatch an `m-click` event. If it was a `pointerdown` event, we'd dispatch an `m-pointerdown`. The
attributes for the elements are typed to include these custom events, so you'll get type support for
them in your editor.

Here's what the custom events we dispatch looks like:

```ts
const customMeltEvent: MeltEvent<typeof originalEvent> = new CustomEvent(
	`m-${originalEvent.type}`,
	{
		detail: {
			originalEvent
		},
		cancelable: true
	}
)
```

By marking the custom event as `cancelable`, you may use `preventDefault` on it, which signals Melt
to immediately stop handling the event, thus preventing the builder's default behavior from
happening.

We also pass the original event as a property on the `detail` object so that you can access it in
case you'd like to do something else with it.

So if you in fact wanted to override the default behavior of a `click` event on a `trigger` element,
then you could do something like this:

```svelte {3-6}
<button
	use:melt={$trigger}
	on:m-click={(e) => {
		e.preventDefault()
		// do something else
	}}>
	Trigger
</button>
```

<Callout type="warning">

Overriding the default behavior of a component should be done with caution. We can't guarantee that
everything will work as expected if you override certain events, but we provide this feature to
cover those edge cases where you want to do something that the library won't support out of the box.

</Callout>
