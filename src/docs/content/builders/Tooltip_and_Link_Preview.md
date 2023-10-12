#Tool Tooltip_and_Link_Preview
---
title: Tooltip and Link Preview
description:
  A popup that displays information related to an element when the element receives keyboard focus
  or the mouse hovers over it.
---

<script>
    import { APIReference, KbdTable, Callout } from '$docs/components'
    export let schemas
    export let keyboard
</script>

# Documenting Differences Between Tooltip and Link-Preview in Melt UI

In the context of Melt UI, tooltips and link previews serve different purposes and have distinct characteristics. Below, I'll document the key differences between tooltips and link previews in Melt UI:

## Tooltips

### Functionality
- Tooltips are small, pop-up informational boxes that appear when a user hovers their cursor over or clicks on a specific UI element (e.g., a button, icon, or text link).
- They provide additional context or supplementary information related to the UI element they are associated with.

### Content
- Tooltip content is typically concise and designed to offer quick, contextual information, such as help text, short descriptions, or clarifications.

### Appearance
- Tooltips are usually minimalistic and compact in design, often a small box or bubble containing text.
- They are meant to be unobtrusive and not distract from the main content.

### User Interaction
- Tooltips are usually triggered by user actions like hovering or clicking. They disappear when the user moves their cursor away from the associated UI element.

## Link Previews

### Functionality
- Link previews are a feature that provides a visual representation and summary of an external web page or resource linked within a Melt UI interface.

### Content
- Link previews typically include elements like the title of the linked page, a snippet of text, an image or icon, and sometimes additional information such as the source or publication date.

### Appearance
- Link previews are larger and more visually engaging than tooltips. They often include images, making them suitable for previewing web pages or articles.

### User Interaction
- Link previews are typically generated automatically when a user posts a link, and they are often static. Users can usually click on the link preview to navigate to the linked web page.

## Use Cases
- Tooltips are used for enhancing the user experience by providing supplementary information or guidance within the Melt UI.
- Link previews are used when users share URLs in messages or posts, giving a preview of the linked content, which can be especially useful for social media, chat applications, or content sharing platforms.

## In Summary
Tooltips are small, text-based pop-ups that provide additional information within the Melt UI, while link previews are larger, visually engaging previews of external web content shared within the UI. Each serves a specific purpose and is triggered differently by user actions.
