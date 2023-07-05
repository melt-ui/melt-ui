import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createToggle } from "./create14.js";
import { I as Italic } from "./italic.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toggle, $$unsubscribe_toggle;
  const { toggle } = createToggle();
  $$unsubscribe_toggle = subscribe(toggle, (value) => $toggle = value);
  $$unsubscribe_toggle();
  return `<div class="flex w-full items-center justify-center"><button${spread(
    [
      escape_object($toggle),
      { "aria-label": "Toggle italic" },
      {
        class: "grid h-9 w-9 place-items-center items-center justify-center rounded bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100 data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200 data-[state=on]:text-magnum-900"
      }
    ],
    {}
  )}>${validate_component(Italic, "Italic").$$render($$result, {}, {}, {})}</button></div>`;
});
export {
  Tailwind as default
};
