import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createPopover, S as Settings2 } from "./settings2.js";
import { X } from "./x.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: "fieldset.svelte-8whtbw{display:flex;align-items:center;gap:1.25rem\n}label.svelte-8whtbw{width:75px;font-size:0.875rem;line-height:1.25rem;--tw-text-opacity:1;color:rgb(64 64 64 / var(--tw-text-opacity))\n}p.svelte-8whtbw{margin-bottom:0.5rem;font-weight:500;--tw-text-opacity:1;color:rgb(23 23 23 / var(--tw-text-opacity))\n}.input.svelte-8whtbw{display:flex;height:2rem;width:100%;border-radius:0.375rem;border-width:1px;--tw-border-opacity:1;border-color:rgb(150 69 22 / var(--tw-border-opacity));background-color:transparent;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;--tw-ring-offset-color:#f9c978\n}.input.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:1px\n}.input.svelte-8whtbw{flex:1 1 0%;align-items:center;justify-content:center;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;line-height:1;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity))\n}.trigger.svelte-8whtbw{display:inline-flex;height:2.25rem;width:2.25rem;align-items:center;justify-content:center;border-radius:9999px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-8whtbw:hover{background-color:rgb(255 255 255 / 0.9)\n}.trigger.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}.close.svelte-8whtbw{position:absolute;right:0.375rem;top:0.375rem;display:flex;height:1.75rem;width:1.75rem;align-items:center;justify-content:center;border-radius:9999px;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.close.svelte-8whtbw:hover{background-color:rgb(243 141 28 / 0.1)\n}.close.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}.close.svelte-8whtbw{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500\n}.content.svelte-8whtbw{z-index:10;width:15rem;border-radius:4px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:1.25rem;--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let $arrow, $$unsubscribe_arrow;
  const { trigger, content, open, arrow, close } = createPopover();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_arrow = subscribe(arrow, (value) => $arrow = value);
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_content();
  $$unsubscribe_arrow();
  return `<div class="flex items-center justify-center"><button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($trigger),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-8whtbw" }
  )}>${validate_component(Settings2, "Settings2").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-joms16">Open Popover</span></button> ${$open ? `<div${spread([escape_object($content), { class: "content" }], { classes: "svelte-8whtbw" })}><div${spread([escape_object($arrow)], { classes: "svelte-8whtbw" })}></div> <div class="flex flex-col gap-2.5" data-svelte-h="svelte-10kwfyp"><p class="svelte-8whtbw">Dimensions</p> <fieldset class="svelte-8whtbw"><label for="width" class="svelte-8whtbw">Width</label> <input id="width" value="100%" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="maxWidth" class="svelte-8whtbw">Max. width</label> <input id="maxWidth" value="300px" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="height" class="svelte-8whtbw">Height</label> <input id="height" value="25px" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="maxHeight" class="svelte-8whtbw">Max. height</label> <input id="maxHeight" class="input svelte-8whtbw"></fieldset></div> <button${spread([{ class: "close" }, escape_object(close)], { classes: "svelte-8whtbw" })}>${validate_component(X, "X").$$render($$result, { class: "h-4 w-4 " }, {}, {})}</button></div>` : ``} </div>`;
});
export {
  Tailwind as default
};
