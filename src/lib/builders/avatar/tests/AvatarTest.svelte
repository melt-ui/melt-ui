<script lang="ts">
  import { createAvatar } from "..";

  export let src = "https://avatars.githubusercontent.com/u/1162160?v=4"

  const { root, image, fallback } = createAvatar({
    src
  });
</script>

<div {...$root} class="rounded-full bg-neutral-100 w-24 h-24 flex justify-center items-center" data-testid="root">
  <img {...$image} alt="Avatar" class="w-full h-full rounded-[inherit]" data-testid="image" />
  <span {...$fallback} class="text-black text-3xl font-medium" data-testid="fallback">RH</span>
</div>