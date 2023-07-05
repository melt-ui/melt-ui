import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each } from "./ssr.js";
import "./clickOutside.js";
import { c as createSlider } from "./create12.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  return `<div class="flex w-full items-center justify-center"><span${spread(
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
  })}</span></div>`;
});
export {
  Tailwind as default
};
