import type { Collapsible } from '$lib'
import CollapsibleExample from './CollapsibleExample.svelte'
import type { ComponentPreview } from './componentPreview'
export const collapsible = {
  title: 'Collapsible',
  description: 'An interactive component which expands/collapses a panel.',
  example: CollapsibleExample,

  props: {
    Root: {
      open: {
        type: 'boolean',
      },
      disabled: {
        type: 'boolean',
      }
    },
    Trigger: {},
    Content: {
      transition: {
        type: 'boolean',
      }
    }
  },
} satisfies ComponentPreview<typeof Collapsible>