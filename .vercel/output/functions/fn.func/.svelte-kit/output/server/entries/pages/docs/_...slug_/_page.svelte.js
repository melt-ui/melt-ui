import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, g as add_attribute, d as escape, v as validate_component, a as spread, e as escape_object, m as missing_component } from "../../../../chunks/ssr.js";
import { c as cn } from "../../../../chunks/utils2.js";
/* empty css                           */import "../../../../chunks/clickOutside.js";
import { c as createSeparator } from "../../../../chunks/create2.js";
import "../../../../chunks/select.svelte_svelte_type_style_lang.js";
import { p as page } from "../../../../chunks/stores.js";
import { D as Description, T as Table_of_contents } from "../../../../chunks/description.js";
import "clsx";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let component;
  let doc;
  let $separator, $$unsubscribe_separator;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  const { root: separator } = createSeparator();
  $$unsubscribe_separator = subscribe(separator, (value) => $separator = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  component = data.component;
  doc = data.metadata;
  $$unsubscribe_separator();
  $$unsubscribe_page();
  return `<main class="relative px-2 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_240px]"><div class="mx-auto w-full min-w-0"><div class="mb-4 space-y-2 md:mb-6"><h1${add_attribute("class", cn("scroll-m-20 text-4xl font-bold tracking-tight"), 0)}>${escape(doc.title)}</h1> ${doc.description ? `${validate_component(Description, "Description").$$render($$result, {}, {}, {
    default: () => {
      return `${escape(doc.description)}`;
    }
  })}` : ``}</div> <div class="mdsvex" id="mdsvex">${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div> <div${spread([escape_object($separator), { class: "my-4 md:my-6" }], {})}></div> </div> <div class="hidden text-sm xl:block"><div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">${validate_component(Table_of_contents, "TOC").$$render($$result, {}, {}, {})}</div></div></main>`;
});
export {
  Page as default
};
