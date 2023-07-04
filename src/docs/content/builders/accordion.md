---
title: Accordion
description:
  An interactive component that enables the organization and navigation of
  content by allowing users to expand and collapse sections.
features: |
  - Fully accessible
  - Supports single or multiple open panels
  - Can be controlled or uncontrolled
---

<script>
    import MainPreview from '$docs/previews/accordion/main/tailwind.svelte';
    import Preview from '$docs/components/preview.svelte';

    export let previews
</script>

<Preview code={previews.main} fullwidth>
    <MainPreview />
</Preview>
