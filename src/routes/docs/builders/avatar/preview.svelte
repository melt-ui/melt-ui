<script lang="ts">
	import { createAvatar } from "$lib";
	import { Docs } from "$routes/(components)";

  let fallbackValue = "RH"

  const {root, image, fallback} = createAvatar(
    {
      src: "https://avatars.githubusercontent.com/u/1162160?v=4",
    },
  )
</script>

<Docs.PreviewWrapper>
  <div {...$root} class="rounded-full bg-neutral-100 w-24 h-24 flex justify-center items-center">
  <img {...$image} alt="Avatar" class="w-full h-full rounded-[inherit]" />
    <span {...$fallback} class="text-black text-3xl font-medium">{fallbackValue}</span>
  </div>
</Docs.PreviewWrapper>

