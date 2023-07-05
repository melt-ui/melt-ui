import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, f as escape_attribute_value, d as escape } from "./ssr.js";
import { c as createAccordion } from "./create4.js";
import "./clickOutside.js";
const css_svelte_svelte_type_style_lang = "";
const css = {
  code: ".root.svelte-51q4q1.svelte-51q4q1{margin-left:auto;margin-right:auto;width:100%;max-width:var(--tw-width-md);border-radius:var(--tw-border-radius-md);--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),\n			0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),\n			var(--tw-shadow)}.item.svelte-51q4q1.svelte-51q4q1{margin-top:var(--tw-size-px);overflow:hidden;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.item.svelte-51q4q1.svelte-51q4q1:first-child{margin-top:var(--tw-size-0);border-top-left-radius:var(--tw-border-radius-default);border-top-right-radius:var(--tw-border-radius-default)}.item.svelte-51q4q1.svelte-51q4q1:last-child{border-bottom-right-radius:var(--tw-border-radius-default);border-bottom-left-radius:var(--tw-border-radius-default)}.item.svelte-51q4q1.svelte-51q4q1:focus-within{position:relative;z-index:10;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)\n			var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))\n			var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(var(--tw-color-magnum-400) / var(--tw-ring-opacity))}.item.svelte-51q4q1>h2.svelte-51q4q1{display:flex}.trigger.svelte-51q4q1.svelte-51q4q1{display:flex;height:var(--tw-size-12);flex:1 1 0%;cursor:pointer;align-items:center;justify-content:space-between;--tw-bg-opacity:1;background-color:rgb(var(--tw-color-white) / var(--tw-bg-opacity));padding-left:var(--tw-size-5);padding-right:var(--tw-size-5);font-size:var(--tw-font-size-base);line-height:var(--tw-line-height-6);font-weight:var(--tw-font-weight-medium);line-height:var(--tw-line-height-none);--tw-text-opacity:1;color:rgb(var(--tw-color-magnum-700) / var(--tw-text-opacity));--tw-shadow:0 1px 0;--tw-shadow-colored:0 1px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),\n			var(--tw-shadow);transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.trigger.svelte-51q4q1.svelte-51q4q1:hover{--tw-bg-opacity:0.95}.content.svelte-51q4q1.svelte-51q4q1{overflow:hidden;--tw-bg-opacity:1;background-color:rgb(var(--tw-color-neutral-100) / var(--tw-bg-opacity));font-size:var(--tw-font-size-sm);line-height:var(--tw-line-height-5);--tw-text-opacity:1;color:rgb(var(--tw-color-neutral-900) / var(--tw-text-opacity))}.content.svelte-51q4q1>div.svelte-51q4q1{padding-left:var(--tw-size-5);padding-right:var(--tw-size-5);padding-top:var(--tw-size-4);padding-bottom:var(--tw-size-4)}",
  map: null
};
const Css = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $item, $$unsubscribe_item;
  let $trigger, $$unsubscribe_trigger;
  let $isSelected, $$unsubscribe_isSelected;
  let $content, $$unsubscribe_content;
  const { content, item, trigger, isSelected, root } = createAccordion();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  const items = [
    {
      id: "item-1",
      title: "Is it accessible?",
      description: "Yes. It adheres to the WAI-ARIA design pattern."
    },
    {
      id: "item-2",
      title: "Is it unstyled?",
      description: "Yes. It's unstyled by default, giving you freedom over the look and feel."
    },
    {
      id: "item-3",
      title: "Can it be animated?",
      description: "Yes! You can use the transition prop to configure the animation."
    }
  ];
  $$result.css.add(css);
  $$unsubscribe_item();
  $$unsubscribe_trigger();
  $$unsubscribe_isSelected();
  $$unsubscribe_content();
  return `<div${spread([{ class: "root" }, escape_object(root)], { classes: "svelte-51q4q1" })}>${each(items, ({ id, title, description }, i) => {
    return `<div${spread([escape_object($item(id)), { class: "item" }], { classes: "svelte-51q4q1" })}><h2 class="svelte-51q4q1"><button${spread(
      [
        {
          id: escape_attribute_value(i === 0 ? "trigger" : void 0)
        },
        escape_object($trigger(id)),
        { class: "trigger" }
      ],
      { classes: "svelte-51q4q1" }
    )}>${escape(title)} </button></h2> ${$isSelected(id) ? `<div${spread([{ class: "content" }, escape_object($content(id))], { classes: "svelte-51q4q1" })}><div class="svelte-51q4q1">${escape(description)}</div> </div>` : ``} </div>`;
  })} </div>`;
});
export {
  Css as default
};
