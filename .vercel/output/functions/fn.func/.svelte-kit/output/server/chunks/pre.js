import { c as create_ssr_component, g as add_attribute, v as validate_component, a as spread, f as escape_attribute_value, e as escape_object } from "./ssr.js";
import { E as External_link } from "./external-link.js";
import { c as compute_rest_props } from "./utils.js";
import { c as cn } from "./utils2.js";
import { C as Copy } from "./copy.js";
const A = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let internal;
  let { href } = $$props;
  let { rel = void 0 } = $$props;
  let { target = void 0 } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.rel === void 0 && $$bindings.rel && rel !== void 0)
    $$bindings.rel(rel);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  internal = href.startsWith("/");
  return `<a class="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-neutral-100/80"${add_attribute("href", href, 0)}${add_attribute("target", target, 0)}${add_attribute("rel", rel, 0)}>${slots.default ? slots.default({}) : ``} ${!internal ? `${validate_component(External_link, "External").$$render($$result, { class: "h-4 w-4" }, {}, {})}` : ``}</a>`;
});
const H3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h3${spread(
    [
      {
        class: escape_attribute_value(cn("mb-2 mt-11 scroll-m-20 text-xl font-semibold tracking-tight", className))
      },
      { "data-toc": true },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h3>`;
});
const P = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<p${spread(
    [
      {
        class: escape_attribute_value(cn("mb-4 leading-7", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</p>`;
});
const Pre = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<pre${spread(
    [
      {
        class: escape_attribute_value(cn("mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border border-neutral-500/50 bg-neutral-950/60 py-4 font-bold", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>    ${slots.default ? slots.default({}) : ``}
</pre> <button class="absolute right-3 top-3 z-10" aria-label="copy" data-code-copy>${`<div>${validate_component(Copy, "Copy").$$render($$result, { class: "hover:text-magnum-500" }, {}, {})}</div>`}</button>`;
});
export {
  A,
  H3 as H,
  P,
  Pre as a
};
