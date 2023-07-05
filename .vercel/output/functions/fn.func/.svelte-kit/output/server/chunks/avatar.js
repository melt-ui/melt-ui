import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
const metadata = {
  "title": "Avatar",
  "description": "An image element with a fallback for representing the user."
};
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {})}`;
});
export {
  Avatar as default,
  metadata
};
