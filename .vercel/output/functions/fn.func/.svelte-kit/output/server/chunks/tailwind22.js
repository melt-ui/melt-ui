import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createToggleGroup } from "./create15.js";
import { A as Align_left, a as Align_center, b as Align_right } from "./align-right.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".toggle-item.svelte-jirp2q{display:grid;place-items:center;align-items:center;background-color:#fff;color:#964516;font-size:1rem;line-height:1rem;outline:none;height:2.25rem;width:2.25rem}.toggle-item.svelte-jirp2q:hover{background-color:#fef2d6}.toggle-item.svelte-jirp2q:focus{z-index:10}.toggle-item[data-disabled].svelte-jirp2q{cursor:not-allowed}.toggle-item[data-orientation='horizontal'].svelte-jirp2q{border-left-width:1px;border-right-width:1px;border-left-color:transparent;--tw-border-opacity:1;border-right-color:rgb(252 224 172 / var(--tw-border-opacity))}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:first-child{border-top-left-radius:0.25rem;border-bottom-left-radius:0.25rem}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:last-child{border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem;border-right-color:transparent}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl){border-left-width:1px;border-right-width:1px;--tw-border-opacity:1;border-left-color:rgb(252 224 172 / var(--tw-border-opacity));border-right-color:transparent}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl):first-child{border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl):last-child{border-top-left-radius:0.25rem;border-bottom-left-radius:0.25rem;border-left-color:transparent}.toggle-item[data-orientation='vertical'].svelte-jirp2q{border-top-width:1px;border-bottom-width:1px;--tw-border-opacity:1;border-bottom-color:rgb(252 224 172 / var(--tw-border-opacity));border-top-color:transparent}.toggle-item[data-orientation='vertical'].svelte-jirp2q:first-child{border-top-left-radius:0.25rem;border-top-right-radius:0.25rem}.toggle-item[data-orientation='vertical'].svelte-jirp2q:last-child{border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem;border-bottom-color:transparent}.toggle-item[data-state='on'].svelte-jirp2q{--tw-bg-opacity:1;background-color:rgb(252 224 172 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $item, $$unsubscribe_item;
  const { root, item } = createToggleGroup();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$result.css.add(css);
  $$unsubscribe_root();
  $$unsubscribe_item();
  return `<div class="flex w-full items-center justify-center"><div${spread(
    [
      escape_object($root),
      {
        class: "flex items-center data-[orientation='vertical']:flex-col"
      },
      { "aria-label": "Text alignment" }
    ],
    { classes: "svelte-jirp2q" }
  )}><button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("left")),
      { "aria-label": "Left aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_left, "AlignLeft").$$render($$result, {}, {}, {})}</button> <button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("center")),
      { "aria-label": "Center aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_center, "AlignCenter").$$render($$result, {}, {}, {})}</button> <button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("right")),
      { "aria-label": "Right aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_right, "AlignRight").$$render($$result, {}, {}, {})}</button></div> </div>`;
});
export {
  Tailwind as default
};
