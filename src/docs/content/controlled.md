---
title: Controlled
description: MeltUI components are uncontrolled by default, but offer the ability to be controlled.
---

<script>
    import { Callout } from '$docs/components'
</script>

<Callout type="warning">

Controlled components are an optional advanced feature and should only be used when necessary. If
you're unsure if you _need_ to use controlled components, you probably don't.

</Callout>

## Controlled vs. Uncontrolled

There are various definitions for controlled/uncontrolled components, but in the context of MeltUI,
uncontrolled means that the state and stores of a component are created and managed by us.
Controlled means that the user (you) can create and manage the state and stores.

All components are uncontrolled by default, and in most cases, this is more than enough. However,
our goal is to provide as much flexibility as possible, so we offer a few ways to give you more
control over the state & behavior of the components.

## Controlled Usage

For the following examples, we'll use the `Dialog` builder, but the same concepts also apply to
other builders. Be sure to reference the API docs for your builder to see what controlled options
are available.

### Bring Your Own Store (BYOS)

Without you having to do anything, we create an `open` store within the Dialog builder, which
updates when a trigger or close element is clicked/key-downed. We do return this store for you to
use, but let's say you wanted to define your own `open` store in another file and share it with
other components in your app that might need to track or update the open state of the dialog.

You could accomplish this using context or some other hacky solution, but things may become
complicated quickly. Instead, we provide a way to pass your own `open` store to the builder.

It's as simple as passing your own `open` store to the `createDialog` builder.

```svelte {4,10}
<script lang="ts">
	import { createDialog } from '@melt-ui/svelte'

	const customOpen = writable(false)

	const {
		elements: { trigger, overlay, content, title, description, close },
		actions: { portal }
	} = createDialog({
		open: customOpen
	})
</script>
```

Behind the scenes, we're using the custom `open` store you passed in instead of creating our own
within the builder. So your store will be updated as the open store normally would, but you can also
update it outside the builder.

### Custom Change Functions

In addition to passing your own stores, you can also pass your own custom change/updater functions
to handle the state updates manually. These can be used regardless of whether you use a custom
store.

A "change function" is called when the value of a `state` store would normally change. It receives
an object with `prev` and `next` properties, whose values are the previous and next values of the
store.

The `next` value is what the store would have been set to by default if the change function wasn't
used. The `prev` value is the current value of the store.

Whatever is returned from the change function will be used as the new value of the store.

The snippet below shows an example of how the change function could be used to prevent the `open`
store from being set to `true` based on some arbitrary condition.

```svelte {6-12,18}
<script lang="ts">
	import { createDialog, type CreateDialogProps } from '@melt-ui/svelte'

	const someCondition = false

	const handleOpen: CreateDialogProps['onOpenChange'] = ({ prev, next }) => {
		if (!someCondition) {
			return prev
		}

		return next
	}

	const {
		elements: { trigger, overlay, content, title, description, close },
		actions: { portal }
	} = createDialog({
		onOpenChange: handleOpen
	})
</script>
```

Of course this is a contrived example, but at this point you should be able to imagine how you could
use this to do some pretty cool things.
