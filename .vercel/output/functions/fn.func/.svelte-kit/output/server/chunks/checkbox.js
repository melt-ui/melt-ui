import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
const metadata = {
  "title": "Checkbox",
  "description": "A control that allows the user to toggle between checked and not checked."
};
const Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {})}`;
});
export {
  Checkbox as default,
  metadata
};
