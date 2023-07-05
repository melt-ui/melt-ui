import { c as create_ssr_component, g as add_attribute, b as each, d as escape, v as validate_component } from "./ssr.js";
import { s as subscribe } from "./utils.js";
import { p as page } from "./stores.js";
import { c as cn } from "./helpers.js";
import { c as cn$1 } from "./utils2.js";
import { i as isSafari } from "./platform.js";
import { B as Balancer } from "./Balancer.js";
const Tree = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { tree = { items: [] } } = $$props;
  let { level = 1 } = $$props;
  if ($$props.tree === void 0 && $$bindings.tree && tree !== void 0)
    $$bindings.tree(tree);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  $$unsubscribe_page();
  return `<ul${add_attribute("class", cn("m-0 list-none", { "pl-4": level !== 1 }), 0)}>${tree.items && tree.items.length ? `${each(tree.items, (item, i) => {
    return `<li${add_attribute("class", cn("mt-0 pt-2"), 0)}><a${add_attribute("href", item.url, 0)}${add_attribute(
      "class",
      cn("inline-block no-underline transition-colors hover:text-white", item.url === $page.url.hash ? "font-medium text-white" : "text-neutral-300"),
      0
    )}>${escape(item.title)}</a> ${item.items && item.items.length ? `${validate_component(Tree, "svelte:self").$$render($$result, { tree: item, level: level + 1 }, {}, {})}` : ``} </li>`;
  })}` : ``}</ul>`;
});
const Table_of_contents = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredHeadingsList;
  return `<div class="space-y-2"><p class="font-medium" data-svelte-h="svelte-1w0os9y">On This Page</p> ${validate_component(Tree, "Tree").$$render($$result, { tree: filteredHeadingsList }, {}, {})}</div>`;
});
const Description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<p${add_attribute("class", cn$1("mb-4 mt-2 text-xl text-neutral-400", className), 0)}> ${isSafari() ? `${slots.default ? slots.default({}) : ``}` : `${validate_component(Balancer, "Balancer").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`}</p>`;
});
export {
  Description as D,
  Table_of_contents as T
};
