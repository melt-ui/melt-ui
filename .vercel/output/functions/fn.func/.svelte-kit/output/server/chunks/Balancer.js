import { c as compute_rest_props } from "./utils.js";
import { c as create_ssr_component, o as onDestroy, a as spread, f as escape_attribute_value, e as escape_object, g as add_attribute } from "./ssr.js";
import { i as is_void } from "./names.js";
const SYMBOL_KEY = "__wrap_balancer";
const Balancer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["as", "ratio"]);
  const as = "span";
  const ratio = 1;
  let wrapper;
  const id = crypto.randomUUID();
  onDestroy(() => {
  });
  const relayout = (id2, ratio2, wrapper2) => {
    wrapper2 = wrapper2 || document.querySelector(`[data-br="${id2}"]`);
    const container2 = wrapper2.parentElement;
    const update = (width2) => wrapper2.style.maxWidth = width2 + "px";
    wrapper2.style.maxWidth = "";
    const width = container2.clientWidth;
    const height = container2.clientHeight;
    let left = width / 2;
    let right = width;
    let middle;
    if (width) {
      while (left + 1 < right) {
        middle = ~~((left + right) / 2);
        update(middle);
        if (container2.clientHeight === height) {
          right = middle;
        } else {
          left = middle;
        }
      }
      update(right * ratio2 + width * (1 - ratio2));
    }
  };
  const MINIFIED_RELAYOUT_STR = relayout.toString();
  const sp = `<script> window.${SYMBOL_KEY}=${MINIFIED_RELAYOUT_STR};window.${SYMBOL_KEY}("${id}",${ratio}) <\/script>`;
  if ($$props.as === void 0 && $$bindings.as && as !== void 0)
    $$bindings.as(as);
  if ($$props.ratio === void 0 && $$bindings.ratio && ratio !== void 0)
    $$bindings.ratio(ratio);
  return `${((tag) => {
    return tag ? `<${as}${spread(
      [
        { "data-br": escape_attribute_value(id) },
        {
          "data-brr": escape_attribute_value(ratio)
        },
        {
          style: "display: inline-block; vertical-align: top; text-decoration: inherit;"
        },
        escape_object($$restProps)
      ],
      {}
    )}${add_attribute("this", wrapper, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``} <!-- HTML_TAG_START -->${sp}<!-- HTML_TAG_END -->`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(as)}`;
});
export {
  Balancer as B
};
