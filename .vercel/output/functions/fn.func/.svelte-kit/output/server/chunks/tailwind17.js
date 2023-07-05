import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, d as escape } from "./ssr.js";
import "./clickOutside.js";
import { c as createSeparator } from "./create2.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $horizontalSeparator, $$unsubscribe_horizontalSeparator;
  let $vertical, $$unsubscribe_vertical;
  let { orientation = "vertical" } = $$props;
  const { root: vertical } = createSeparator({ orientation });
  $$unsubscribe_vertical = subscribe(vertical, (value) => $vertical = value);
  const { root: horizontalSeparator } = createSeparator({
    orientation: "horizontal",
    decorative: true
  });
  $$unsubscribe_horizontalSeparator = subscribe(horizontalSeparator, (value) => $horizontalSeparator = value);
  const icecreams = ["Caramel", "Vanilla", "Napolitan"];
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  $$unsubscribe_horizontalSeparator();
  $$unsubscribe_vertical();
  return `<h2 class="font-bold" data-svelte-h="svelte-1motaaq">Melt UI</h2> <p data-svelte-h="svelte-uujsbd">Flavors for everyone</p> <div${spread(
    [
      escape_object($horizontalSeparator),
      { class: "my-3.5 h-[1px] w-full bg-white" }
    ],
    {}
  )}></div> <div class="flex items-center space-x-3.5">${each(icecreams, (icecream, i) => {
    return `<p>${escape(icecream)}</p> ${i !== icecreams.length - 1 ? `<div${spread([escape_object($vertical), { class: "h-4 w-[1px] bg-white" }], {})}></div>` : ``}`;
  })}</div>`;
});
export {
  Tailwind as default
};
