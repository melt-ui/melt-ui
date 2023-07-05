import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
const metadata = {
  "title": "Toggle Group",
  "description": "A set of two-state buttons that can be toggled on or off."
};
const Toggle_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {})}`;
});
export {
  Toggle_group as default,
  metadata
};
