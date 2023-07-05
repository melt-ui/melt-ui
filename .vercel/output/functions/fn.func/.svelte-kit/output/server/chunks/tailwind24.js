import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createToolbar, B as Bold, S as Strikethrough } from "./strikethrough.js";
import { I as Italic } from "./italic.js";
import { A as Align_left, a as Align_center, b as Align_right } from "./align-right.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".group.svelte-khzvyd{display:flex;align-items:center;gap:4px}.item.svelte-khzvyd{padding:0.25rem;border-radius:0.375rem}.item.svelte-khzvyd:hover{background-color:#fef2d6}.item[data-state='on'].svelte-khzvyd{background-color:#fce0ac;color:#793a15}.separator.svelte-khzvyd{width:1px;background-color:#d4d4d4;align-self:stretch}.button.svelte-khzvyd{background-color:#e47312;color:#fef2d6;padding:0.25rem 0.75rem;border-radius:0.375rem;font-weight:500;-webkit-margin-start:auto;margin-inline-start:auto}.button.svelte-khzvyd:hover{opacity:0.75}.button.svelte-khzvyd:active{opacity:0.5}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $fontGroup, $$unsubscribe_fontGroup;
  let $fontItem, $$unsubscribe_fontItem;
  let $separator, $$unsubscribe_separator;
  let $alignGroup, $$unsubscribe_alignGroup;
  let $alignItem, $$unsubscribe_alignItem;
  const { root, button, link, separator, createToolbarGroup } = createToolbar();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_separator = subscribe(separator, (value) => $separator = value);
  const { root: fontGroup, item: fontItem } = createToolbarGroup({ type: "multiple" });
  $$unsubscribe_fontGroup = subscribe(fontGroup, (value) => $fontGroup = value);
  $$unsubscribe_fontItem = subscribe(fontItem, (value) => $fontItem = value);
  const { root: alignGroup, item: alignItem } = createToolbarGroup();
  $$unsubscribe_alignGroup = subscribe(alignGroup, (value) => $alignGroup = value);
  $$unsubscribe_alignItem = subscribe(alignItem, (value) => $alignItem = value);
  $$result.css.add(css);
  $$unsubscribe_root();
  $$unsubscribe_fontGroup();
  $$unsubscribe_fontItem();
  $$unsubscribe_separator();
  $$unsubscribe_alignGroup();
  $$unsubscribe_alignItem();
  return `<div${spread(
    [
      escape_object($root),
      {
        class: "flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm"
      }
    ],
    { classes: "svelte-khzvyd" }
  )}><div${spread([{ class: "group" }, escape_object($fontGroup)], { classes: "svelte-khzvyd" })}><button${spread([{ class: "item" }, escape_object($fontItem("bold"))], { classes: "svelte-khzvyd" })}>${validate_component(Bold, "Bold").$$render($$result, {}, {}, {})}</button> <button${spread([{ class: "item" }, escape_object($fontItem("italic"))], { classes: "svelte-khzvyd" })}>${validate_component(Italic, "Italic").$$render($$result, {}, {}, {})}</button> <button${spread([{ class: "item" }, escape_object($fontItem("strikethrough"))], { classes: "svelte-khzvyd" })}>${validate_component(Strikethrough, "Strikethrough").$$render($$result, {}, {}, {})}</button></div> <div${spread([{ class: "separator" }, escape_object($separator)], { classes: "svelte-khzvyd" })}></div> <div${spread([{ class: "group" }, escape_object($alignGroup)], { classes: "svelte-khzvyd" })}><button${spread([{ class: "item" }, escape_object($alignItem("left"))], { classes: "svelte-khzvyd" })}>${validate_component(Align_left, "AlignLeft").$$render($$result, {}, {}, {})}</button> <button${spread([{ class: "item" }, escape_object($alignItem("center"))], { classes: "svelte-khzvyd" })}>${validate_component(Align_center, "AlignCenter").$$render($$result, {}, {}, {})}</button> <button${spread([{ class: "item" }, escape_object($alignItem("right"))], { classes: "svelte-khzvyd" })}>${validate_component(Align_right, "AlignRight").$$render($$result, {}, {}, {})}</button></div> <div${spread([{ class: "separator" }, escape_object($separator)], { classes: "svelte-khzvyd" })}></div>  <a${spread([{ href: "#" }, { class: "link nowrap flex-shrink-0" }, escape_object(link)], { classes: "svelte-khzvyd" })}>Edited 2 hours ago</a> <button${spread([{ class: "button" }, escape_object(button)], { classes: "svelte-khzvyd" })}>Save</button> </div>`;
});
export {
  Tailwind as default
};
