import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, d as escape, v as validate_component, b as each } from "./ssr.js";
import "./clickOutside.js";
import { c as createPagination, C as Chevron_left } from "./chevron-left.js";
import { C as Chevron_right } from "./chevron-right.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: "button.svelte-btbvw9{display:grid;place-items:center;border-radius:0.125rem;background-color:#fff;color:#bd5711;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);font-size:0.875rem;padding-inline:0.75rem;height:2rem}button.svelte-btbvw9:hover{opacity:0.75}button.svelte-btbvw9:disabled{cursor:not-allowed;opacity:0.5}button[data-selected].svelte-btbvw9{background-color:#793a15;color:#fff}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $range, $$unsubscribe_range;
  let $prevButton, $$unsubscribe_prevButton;
  let $pages, $$unsubscribe_pages;
  let $pageTrigger, $$unsubscribe_pageTrigger;
  let $nextButton, $$unsubscribe_nextButton;
  const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
    count: 100,
    perPage: 10,
    page: 1,
    siblingCount: 1
  });
  $$unsubscribe_prevButton = subscribe(prevButton, (value) => $prevButton = value);
  $$unsubscribe_nextButton = subscribe(nextButton, (value) => $nextButton = value);
  $$unsubscribe_pages = subscribe(pages, (value) => $pages = value);
  $$unsubscribe_pageTrigger = subscribe(pageTrigger, (value) => $pageTrigger = value);
  $$unsubscribe_range = subscribe(range, (value) => $range = value);
  $$result.css.add(css);
  $$unsubscribe_range();
  $$unsubscribe_prevButton();
  $$unsubscribe_pages();
  $$unsubscribe_pageTrigger();
  $$unsubscribe_nextButton();
  return `<div class="flex w-full items-center justify-center"><nav${spread(
    [
      {
        class: "flex flex-col items-center gap-4"
      },
      { "aria-label": "pagination" },
      escape_object(root)
    ],
    {}
  )}><p class="text-center">Showing items ${escape($range.start)} - ${escape($range.end)}</p> <div class="flex items-center gap-2"><button${spread([escape_object($prevButton)], { classes: "svelte-btbvw9" })}>${validate_component(Chevron_left, "ChevronLeft").$$render($$result, {}, {}, {})}</button> ${each($pages, (page) => {
    return `${page.type === "ellipsis" ? `<span data-svelte-h="svelte-9cz974">...</span>` : `<button${spread([escape_object($pageTrigger(page))], { classes: "svelte-btbvw9" })}>${escape(page.value)}</button>`}`;
  })} <button${spread([escape_object($nextButton)], { classes: "svelte-btbvw9" })}>${validate_component(Chevron_right, "ChevronRight").$$render($$result, {}, {}, {})}</button></div></nav> </div>`;
});
export {
  Tailwind as default
};
