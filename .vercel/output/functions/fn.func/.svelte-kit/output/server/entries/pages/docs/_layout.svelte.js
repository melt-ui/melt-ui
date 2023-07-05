import { c as create_ssr_component, b as each, d as escape, g as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import "clsx";
import "shiki-es";
/* empty css                        */import "../../../chunks/clickOutside.js";
import "../../../chunks/select.svelte_svelte_type_style_lang.js";
import { s as subscribe } from "../../../chunks/utils.js";
import { p as page } from "../../../chunks/stores.js";
import { c as cn } from "../../../chunks/utils2.js";
import { n as navConfig } from "../../../chunks/config.js";
const Sidebar_nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<nav class="flex w-full flex-col gap-4">${each(navConfig.sidebarNav, (navItem, index) => {
    return `<div><span class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">${escape(navItem.title)}</span> <div class="grid grid-flow-row auto-rows-max">${navItem?.items?.length ? `${each(navItem.items, (item) => {
      return `${!item.disabled && item.href ? `<div class="px-1"><a${add_attribute("href", item.href, 0)}${add_attribute("class", cn("block whitespace-nowrap rounded-md border border-transparent px-3 py-2 font-medium capitalize", "hover:bg-magnum-600/25", "data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25"), 0)}${add_attribute("data-active", $page.url.pathname === item.href, 0)}>${escape(item.title)}</a> </div>` : ``}`;
    })}` : ``}</div> </div>`;
  })}</nav>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:gap-10"><aside class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block"><div class="py-6 pr-6 lg:py-8">${validate_component(Sidebar_nav, "SidebarNav").$$render($$result, {}, {}, {})}</div></aside> <div class="mx-auto w-full min-w-0">${slots.default ? slots.default({}) : ``}</div></div>`;
});
export {
  Layout as default
};
