import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, g as add_attribute } from "./ssr.js";
import "./clickOutside.js";
import { c as createProgress } from "./create10.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let $value, $$unsubscribe_value;
  let $max, $$unsubscribe_max;
  const { progress, value, max } = createProgress({ value: 30, max: 100 });
  $$unsubscribe_progress = subscribe(progress, (value2) => $progress = value2);
  $$unsubscribe_value = subscribe(value, (value2) => $value = value2);
  $$unsubscribe_max = subscribe(max, (value2) => $max = value2);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  sleep(1e3).then(() => {
    value.set(75);
  });
  $$unsubscribe_progress();
  $$unsubscribe_value();
  $$unsubscribe_max();
  return `<div class="flex items-center justify-center"><div${spread(
    [
      escape_object($progress),
      {
        class: "relative h-6 w-[300px] overflow-hidden rounded-[99999px] bg-black/40"
      }
    ],
    {}
  )}><div class="h-full w-full bg-[white] transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]"${add_attribute("style", `transform: translateX(-${100 - 100 * ($value ?? 0) / ($max ?? 1)}%)`, 0)}></div></div></div>`;
});
export {
  Tailwind as default
};
