import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
const metadata = {
  "title": "Radio Group",
  "description": "A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be checked at a time."
};
const Radio_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {})}`;
});
export {
  Radio_group as default,
  metadata
};
