import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, d as escape, v as validate_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createTagsInput } from "./create13.js";
import { X } from "./x.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".tag.svelte-1ce5f72{display:flex;align-items:center;overflow:hidden;border-radius:0.375rem;word-break:break-word;--tw-bg-opacity:1;background-color:rgb(228 115 18 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))\n}.tag[data-selected].svelte-1ce5f72{--tw-bg-opacity:1;background-color:rgb(20 184 166 / var(--tw-bg-opacity))\n}.tag[data-disabled].svelte-1ce5f72{--tw-bg-opacity:1;background-color:rgb(249 201 120 / var(--tw-bg-opacity))\n}.tag:hover[data-disabled].svelte-1ce5f72{cursor:default\n}.tag:focus[data-disabled].svelte-1ce5f72{outline:2px solid transparent !important;outline-offset:2px !important;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important\n}.tag-delete.svelte-1ce5f72{display:flex;height:100%;align-items:center;padding-left:0.25rem;padding-right:0.25rem\n}.tag-delete.svelte-1ce5f72:hover:enabled{--tw-bg-opacity:1;background-color:rgb(189 87 17 / var(--tw-bg-opacity))\n}.tag-delete:hover[data-selected].svelte-1ce5f72{--tw-bg-opacity:1;background-color:rgb(13 148 136 / var(--tw-bg-opacity))\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $tags, $$unsubscribe_tags;
  let $tag, $$unsubscribe_tag;
  let $deleteTrigger, $$unsubscribe_deleteTrigger;
  let $input, $$unsubscribe_input;
  const { root, input, tags, tag, deleteTrigger } = createTagsInput({ tags: ["one", "two"] });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_input = subscribe(input, (value) => $input = value);
  $$unsubscribe_tags = subscribe(tags, (value) => $tags = value);
  $$unsubscribe_tag = subscribe(tag, (value) => $tag = value);
  $$unsubscribe_deleteTrigger = subscribe(deleteTrigger, (value) => $deleteTrigger = value);
  $$result.css.add(css);
  $$unsubscribe_root();
  $$unsubscribe_tags();
  $$unsubscribe_tag();
  $$unsubscribe_deleteTrigger();
  $$unsubscribe_input();
  return `<div class="flex flex-col items-center justify-center gap-2 overflow-hidden"><div${spread(
    [
      escape_object($root),
      {
        class: "flex w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700"
      }
    ],
    { classes: "svelte-1ce5f72" }
  )}>${each($tags, (t) => {
    return `<div${spread([escape_object($tag(t)), { class: "tag" }], { classes: "svelte-1ce5f72" })}><span class="flex items-center border-r border-white/10 px-1.5">${escape(t.value)}</span> <button${spread([escape_object($deleteTrigger(t)), { class: "tag-delete" }], { classes: "svelte-1ce5f72" })}>${validate_component(X, "X").$$render($$result, { class: "h-3 w-3" }, {}, {})}</button> </div>`;
  })} <input${spread(
    [
      escape_object($input),
      { type: "text" },
      {
        class: "shake min-w-[4.5rem] shrink grow basis-0 border-0 outline-none focus:!ring-0"
      }
    ],
    { classes: "svelte-1ce5f72" }
  )}></div> </div>`;
});
export {
  Tailwind as default
};
