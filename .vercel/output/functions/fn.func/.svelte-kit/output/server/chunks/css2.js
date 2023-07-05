import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, d as escape } from "./ssr.js";
import "./clickOutside.js";
import { c as createSeparator } from "./create2.js";
const css_svelte_svelte_type_style_lang = "";
const css = {
  code: "h2.svelte-w0h1gy{font-weight:var(--tw-font-weight-bold)}.ice-creams.svelte-w0h1gy{display:flex;align-items:center;-moz-column-gap:var(--tw-size-3_5);column-gap:var(--tw-size-3_5)}.separator.svelte-w0h1gy{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.separator--horizontal.svelte-w0h1gy{margin-top:var(--tw-size-3_5);margin-bottom:var(--tw-size-3_5);height:1px;width:100%}.separator--vertical.svelte-w0h1gy{height:var(--tw-size-4);width:1px}",
  map: null
};
const Css = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css);
  $$unsubscribe_horizontalSeparator();
  $$unsubscribe_vertical();
  return `<h2 class="svelte-w0h1gy" data-svelte-h="svelte-pdt9mi">Melt UI</h2> <p data-svelte-h="svelte-uujsbd">Flavors for everyone</p> <div${spread(
    [
      escape_object($horizontalSeparator),
      { class: "separator separator--horizontal" }
    ],
    { classes: "svelte-w0h1gy" }
  )}></div> <div class="ice-creams svelte-w0h1gy">${each(icecreams, (icecream, i) => {
    return `<p>${escape(icecream)}</p> ${i !== icecreams.length - 1 ? `<div${spread([escape_object($vertical), { class: "separator separator--vertical" }], { classes: "svelte-w0h1gy" })}></div>` : ``}`;
  })} </div>`;
});
export {
  Css as default
};
