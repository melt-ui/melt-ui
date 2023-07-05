import { c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, a as spread, f as escape_attribute_value, e as escape_object } from "./ssr.js";
import { i as is_void } from "./names.js";
import { c as cn, n as noopAction } from "./utils2.js";
import { b as buttonVariants } from "./select.svelte_svelte_type_style_lang.js";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "href", "type", "variant", "size", "action"]);
  let { class: className = void 0 } = $$props;
  let { href = void 0 } = $$props;
  let { type = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { action = noopAction } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  return `${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        {
          type: escape_attribute_value(href ? void 0 : type)
        },
        { href: escape_attribute_value(href) },
        {
          class: escape_attribute_value(cn(buttonVariants({ variant, size, className })))
        },
        escape_object($$restProps),
        { role: "button" },
        { tabindex: "0" }
      ],
      {}
    )}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}`;
});
export {
  Button as B
};
