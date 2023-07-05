import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createSlider } from "../../../../../chunks/create12.js";
const tw = `<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';

	const { slider, range, thumb, value } = createSlider({
		value: [30],
		max: 100,
	});
<\/script>

<span {...$slider} class="relative flex h-[20px] w-[200px] items-center">
	<span class="block h-[3px] w-full bg-black/40">
		<span {...$range} class="h-[3px] bg-white" />
	</span>

	{#each { length: $value.length } as _}
		<span
			{...$thumb()}
			use:thumb.action
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	{/each}
</span>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $slider, $$unsubscribe_slider;
  let $range, $$unsubscribe_range;
  let $value, $$unsubscribe_value;
  let $thumb, $$unsubscribe_thumb;
  const { slider, range, thumb, value } = createSlider({ value: [30], max: 100 });
  $$unsubscribe_slider = subscribe(slider, (value2) => $slider = value2);
  $$unsubscribe_range = subscribe(range, (value2) => $range = value2);
  $$unsubscribe_thumb = subscribe(thumb, (value2) => $thumb = value2);
  $$unsubscribe_value = subscribe(value, (value2) => $value = value2);
  $$unsubscribe_slider();
  $$unsubscribe_range();
  $$unsubscribe_value();
  $$unsubscribe_thumb();
  return `<span${spread(
    [
      escape_object($slider),
      {
        class: "relative flex h-[20px] w-[200px] items-center"
      }
    ],
    {}
  )}><span class="block h-[3px] w-full bg-black/40"><span${spread([escape_object($range), { class: "h-[3px] bg-white" }], {})}></span></span> ${each({ length: $value.length }, (_) => {
    return `<span${spread(
      [
        escape_object($thumb()),
        {
          class: "block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
        }
      ],
      {}
    )}></span>`;
  })}</span>`;
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
