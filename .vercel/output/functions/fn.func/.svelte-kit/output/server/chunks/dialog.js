import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
const metadata = {
  "title": "Dialog",
  "description": "A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
};
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {})}`;
});
export {
  Dialog as default,
  metadata
};
