import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "../../../../../chunks/ssr.js";
import { c as createAvatar } from "../../../../../chunks/create5.js";
import "../../../../../chunks/clickOutside.js";
const tw = `<script lang="ts">
	import { createAvatar } from '@melt-ui/svelte';

	const { image, fallback } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/1162160?v=4',
	});

	// With an exaggerated fallback delay
	const { image: imageA, fallback: fallbackA } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/5968653?v=4',
		delayMs: 650,
	});

	// A blank source to demonstrate the fallback
	const { image: imageB, fallback: fallbackB } = createAvatar({
		src: '',
	});
<\/script>

<div class="flex items-center gap-6">
	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallback} class="text-3xl font-medium text-magnum-700">RH</span>
	</div>

	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$imageA} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallbackA} class="text-3xl font-medium text-magnum-700">SH</span>
	</div>

	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$imageB} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallbackB} class="text-3xl font-medium text-magnum-700">UI</span>
	</div>
</div>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $image, $$unsubscribe_image;
  let $fallback, $$unsubscribe_fallback;
  let $imageA, $$unsubscribe_imageA;
  let $fallbackA, $$unsubscribe_fallbackA;
  let $imageB, $$unsubscribe_imageB;
  let $fallbackB, $$unsubscribe_fallbackB;
  const { image, fallback } = createAvatar({
    src: "https://avatars.githubusercontent.com/u/1162160?v=4"
  });
  $$unsubscribe_image = subscribe(image, (value) => $image = value);
  $$unsubscribe_fallback = subscribe(fallback, (value) => $fallback = value);
  const { image: imageA, fallback: fallbackA } = createAvatar({
    src: "https://avatars.githubusercontent.com/u/5968653?v=4",
    delayMs: 650
  });
  $$unsubscribe_imageA = subscribe(imageA, (value) => $imageA = value);
  $$unsubscribe_fallbackA = subscribe(fallbackA, (value) => $fallbackA = value);
  const { image: imageB, fallback: fallbackB } = createAvatar({ src: "" });
  $$unsubscribe_imageB = subscribe(imageB, (value) => $imageB = value);
  $$unsubscribe_fallbackB = subscribe(fallbackB, (value) => $fallbackB = value);
  $$unsubscribe_image();
  $$unsubscribe_fallback();
  $$unsubscribe_imageA();
  $$unsubscribe_fallbackA();
  $$unsubscribe_imageB();
  $$unsubscribe_fallbackB();
  return `<div class="flex items-center gap-6"><div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"><img${spread(
    [
      escape_object($image),
      { alt: "Avatar" },
      { class: "h-full w-full rounded-[inherit]" }
    ],
    {}
  )}> <span${spread(
    [
      escape_object($fallback),
      {
        class: "text-3xl font-medium text-magnum-700"
      }
    ],
    {}
  )}>RH</span></div> <div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"><img${spread(
    [
      escape_object($imageA),
      { alt: "Avatar" },
      { class: "h-full w-full rounded-[inherit]" }
    ],
    {}
  )}> <span${spread(
    [
      escape_object($fallbackA),
      {
        class: "text-3xl font-medium text-magnum-700"
      }
    ],
    {}
  )}>SH</span></div> <div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"><img${spread(
    [
      escape_object($imageB),
      { alt: "Avatar" },
      { class: "h-full w-full rounded-[inherit]" }
    ],
    {}
  )}> <span${spread(
    [
      escape_object($fallbackB),
      {
        class: "text-3xl font-medium text-magnum-700"
      }
    ],
    {}
  )}>UI</span></div></div>`;
});
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = null;
const preview = {
  component: Preview,
  code: {
    Tailwind,
    CSS
  }
};
async function load() {
  return {
    preview
  };
}
export {
  load
};
