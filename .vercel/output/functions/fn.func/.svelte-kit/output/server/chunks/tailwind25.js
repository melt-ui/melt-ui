import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createTooltip, P as Plus } from "./plus.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".trigger.svelte-1ekglum{display:inline-flex;height:2.25rem;width:2.25rem;align-items:center;justify-content:center;border-radius:9999px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-1ekglum:hover{background-color:rgb(255 255 255 / 0.9)\n}.trigger.svelte-1ekglum:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let $arrow, $$unsubscribe_arrow;
  const { trigger, content, open, arrow } = createTooltip({
    positioning: { placement: "top" },
    openDelay: 500,
    closeDelay: 250
  });
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_arrow = subscribe(arrow, (value) => $arrow = value);
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_content();
  $$unsubscribe_arrow();
  return `<div class="flex w-full items-center justify-center"><button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($trigger),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-1ekglum" }
  )}>${validate_component(Plus, "Plus").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-joms16">Open Popover</span></button> ${$open ? `<div${spread(
    [
      escape_object($content),
      {
        class: "z-10 rounded-md bg-white shadow-sm"
      }
    ],
    { classes: "svelte-1ekglum" }
  )}><div${spread([escape_object($arrow)], { classes: "svelte-1ekglum" })}></div> <p class="px-4 py-1 text-magnum-700" data-svelte-h="svelte-1sz6fzr">Add to library</p></div>` : ``} </div>`;
});
export {
  Tailwind as default
};
