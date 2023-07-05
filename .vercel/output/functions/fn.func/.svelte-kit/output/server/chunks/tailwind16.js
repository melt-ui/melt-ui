import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, d as escape, v as validate_component, b as each } from "./ssr.js";
import "./clickOutside.js";
import { c as createSelect, C as Chevron_down } from "./chevron-down.js";
import { C as Check } from "./check.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".label.svelte-3b77pf{padding-top:0.25rem;padding-bottom:0.25rem;padding-left:1rem;padding-right:1rem;font-weight:600;text-transform:capitalize;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity))\n}.menu.svelte-3b77pf{z-index:10;display:flex;max-height:360px;flex-direction:column;overflow-y:auto;border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0.25rem;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important\n}.option.svelte-3b77pf{position:relative;cursor:pointer;border-radius:0.375rem;padding-top:0.25rem;padding-bottom:0.25rem;padding-left:2rem;padding-right:1rem;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity))\n}.option.svelte-3b77pf:focus{z-index:10;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity))\n}.option[data-highlighted].svelte-3b77pf{--tw-bg-opacity:1;background-color:rgb(255 249 237 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))\n}.option[data-selected].svelte-3b77pf{--tw-bg-opacity:1;background-color:rgb(254 242 214 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))\n}.trigger.svelte-3b77pf{display:flex;height:2.5rem;min-width:220px;align-items:center;justify-content:space-between;border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity));transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-3b77pf:hover{opacity:0.9\n}.check.svelte-3b77pf{position:absolute;left:0.5rem;top:50%;z-index:20;--tw-text-opacity:1;color:rgb(243 141 28 / var(--tw-text-opacity));translate:0 calc(-50% + 1px)\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $label, $$unsubscribe_label;
  let $menu, $$unsubscribe_menu;
  let $option, $$unsubscribe_option;
  let $isSelected, $$unsubscribe_isSelected;
  const { label, trigger, menu, option, isSelected, createGroup } = createSelect();
  $$unsubscribe_label = subscribe(label, (value) => $label = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_option = subscribe(option, (value) => $option = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  const options = {
    sweet: ["Caramel", "Chocolate", "Strawberry", "Cookies & Cream"],
    savory: ["Basil", "Bacon", "Rosemary", "Balsamic Fig"]
  };
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_label();
  $$unsubscribe_menu();
  $$unsubscribe_option();
  $$unsubscribe_isSelected();
  return `<div class="flex w-full items-center justify-center"><button${spread([{ class: "trigger" }, escape_object($trigger), { "aria-label": "Food" }], { classes: "svelte-3b77pf" })}>${escape($label || "Select an option")} ${validate_component(Chevron_down, "ChevronDown").$$render($$result, {}, {}, {})}</button> <div${spread([{ class: "menu" }, escape_object($menu)], { classes: "svelte-3b77pf" })}>${each(Object.entries(options), ([key, arr]) => {
    let { group, label: label2 } = createGroup();
    return ` <div${spread([escape_object(group)], { classes: "svelte-3b77pf" })}><div${spread([{ class: "label" }, escape_object(label2)], { classes: "svelte-3b77pf" })}>${escape(key)}</div> ${each(arr, (item) => {
      return `<div${spread([{ class: "option" }, escape_object($option({ value: item, label: item }))], { classes: "svelte-3b77pf" })}>${$isSelected(item) ? `<div class="check svelte-3b77pf">${validate_component(Check, "Check").$$render($$result, {}, {}, {})} </div>` : ``} ${escape(item)} </div>`;
    })} </div>`;
  })}</div> </div>`;
});
export {
  Tailwind as default
};
