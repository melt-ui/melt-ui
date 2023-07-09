---
title: Avatar
description: An image element with a fallback for representing the user.
---

<script>
    import { APITable, KbdTable } from '$docs/components'
    export let data
</script>

## Anatomy

- **Image**: The image element that displays the user's profile picture
- **Fallback**: The fallback element that displays while the image loads or if the image
  fails to load

## API Reference

<APITable data={data.builder} />
