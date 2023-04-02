# Description

This folder contains the preview components and helpers for the docs.

## Folder Structure

Inside `(previews)`, you will find folders named after the component they are previewing. Each folder contains three files:

- `example.svelte`: The preview component
- `schema.ts`: The schema for the preview component, which also includes a reference to the preview component

You will also find two files. `helpers.ts` contains helper functions for the preview components. `schemas.ts` re-exports the schemas in an object.
