import { c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, a as spread, f as escape_attribute_value, e as escape_object } from "./ssr.js";
import { c as cn } from "./utils2.js";
const H2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h2${spread(
    [
      {
        class: escape_attribute_value(cn("mb-2.5 mt-11 scroll-m-20 border-b border-neutral-300/30 pb-1 text-[27px] font-semibold tracking-tight", className))
      },
      { "data-toc": "" },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h2>`;
});
export {
  H2 as H
};
