import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
import "./clickOutside.js";
import { c as createTabs } from "./create8.js";
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".root.svelte-1mjlia9{display:flex;flex-direction:column;overflow:hidden;border-radius:0.375rem;--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.root[data-orientation=vertical].svelte-1mjlia9{flex-direction:row}.list.svelte-1mjlia9{display:flex;flex-shrink:0;border-bottom-width:1px;--tw-border-opacity:1;border-color:rgb(254 242 214 / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.list[data-orientation=vertical].svelte-1mjlia9{flex-direction:column;border-right-width:1px}.list.svelte-1mjlia9{overflow-x:auto}.trigger.svelte-1mjlia9{display:flex;height:2.75rem;flex:1 1 0%;cursor:default;-webkit-user-select:none;-moz-user-select:none;user-select:none;align-items:center;justify-content:center;border-radius:0px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-left:1rem;padding-right:1rem;line-height:1;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))}.trigger.svelte-1mjlia9:focus{position:relative}.trigger[data-orientation='vertical'].svelte-1mjlia9{width:100%;flex-grow:0;border-radius:0px;border-bottom-width:1px;border-right-width:2px;border-color:transparent;--tw-border-opacity:1;border-bottom-color:rgb(254 242 214 / var(--tw-border-opacity));padding-top:1rem;padding-bottom:1rem}.trigger[data-orientation='vertical'].svelte-1mjlia9:last-child{border-bottom-width:0px}.trigger[data-state='active'].svelte-1mjlia9{--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity))}.trigger[data-state='active'].svelte-1mjlia9:focus{position:relative}.trigger[data-state='active'][data-orientation='horizontal'].svelte-1mjlia9{--tw-shadow:inset 0 -1px 0 0,0 1px 0 0;--tw-shadow-colored:inset 0 -1px 0 0 var(--tw-shadow-color), 0 1px 0 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);--tw-shadow-color:currentColor;--tw-shadow:var(--tw-shadow-colored)}.trigger[data-state='active'][data-orientation='horizontal'].svelte-1mjlia9:focus{position:relative}.trigger[data-state='active'][data-orientation='vertical'].svelte-1mjlia9{--tw-border-opacity:1;border-right-color:rgb(243 141 28 / var(--tw-border-opacity))}.content.svelte-1mjlia9{flex-grow:1;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:1.25rem}.description.svelte-1mjlia9{margin-bottom:1.25rem;line-height:1.5;--tw-text-opacity:1;color:rgb(65 28 9 / var(--tw-text-opacity))}fieldset.svelte-1mjlia9{margin-bottom:1rem;display:flex;width:100%;flex-direction:column;justify-content:flex-start}label.svelte-1mjlia9{margin-bottom:0.625rem;display:block;font-size:0.875rem;line-height:1.25rem;line-height:1;--tw-text-opacity:1;color:rgb(65 28 9 / var(--tw-text-opacity))}input.svelte-1mjlia9{height:2rem;flex-shrink:0;flex-grow:1;border-radius:0.25rem;border-width:1px;padding-left:0.625rem;padding-right:0.625rem;line-height:1;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))}input.svelte-1mjlia9:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(150 69 22 / var(--tw-ring-opacity))}.actions.svelte-1mjlia9{margin-top:1.25rem;display:flex;justify-content:flex-end}button.svelte-1mjlia9{display:inline-flex;height:2rem;cursor:default;align-items:center;justify-content:center;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(220 252 231 / var(--tw-bg-opacity));padding-left:15px;padding-right:15px;font-weight:500;line-height:1;--tw-text-opacity:1;color:rgb(20 83 45 / var(--tw-text-opacity))}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $list, $$unsubscribe_list;
  let $trigger, $$unsubscribe_trigger;
  let $content, $$unsubscribe_content;
  const { root, list, content, trigger } = createTabs({ value: "tab1" });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_list = subscribe(list, (value) => $list = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$result.css.add(css);
  $$unsubscribe_root();
  $$unsubscribe_list();
  $$unsubscribe_trigger();
  $$unsubscribe_content();
  return `<div class="flex items-center justify-center"><div${spread([escape_object($root), { class: "root" }], { classes: "svelte-1mjlia9" })}><div${spread(
    [
      escape_object($list),
      { class: "list" },
      { "aria-label": "Manage your account" }
    ],
    { classes: "svelte-1mjlia9" }
  )}><button${spread([escape_object($trigger("tab1")), { class: "trigger" }], { classes: "svelte-1mjlia9" })}>Account</button> <button${spread([escape_object($trigger("tab2")), { class: "trigger" }], { classes: "svelte-1mjlia9" })}>Password</button>  <button${spread(
    [
      escape_object($trigger({ value: "tab3", disabled: true })),
      { class: "trigger opacity-50" }
    ],
    { classes: "svelte-1mjlia9" }
  )}>Disabled</button> <button${spread([escape_object($trigger("tab4")), { class: "trigger" }], { classes: "svelte-1mjlia9" })}>Settings</button></div> <div${spread([escape_object($content("tab1")), { class: "content" }], { classes: "svelte-1mjlia9" })}><p class="description svelte-1mjlia9" data-svelte-h="svelte-1syzrrd">Make changes to your account here. Click save when you&#39;re done.</p> <fieldset class="svelte-1mjlia9" data-svelte-h="svelte-1qkvq8s"><label for="name" class="svelte-1mjlia9">Name</label> <input id="name" value="Thomas G. Lopes" class="svelte-1mjlia9"></fieldset> <div class="actions svelte-1mjlia9" data-svelte-h="svelte-1rizfbm"><button class="svelte-1mjlia9">Save changes</button></div></div> <div${spread([escape_object($content("tab2")), { class: "content" }], { classes: "svelte-1mjlia9" })}><p class="description svelte-1mjlia9" data-svelte-h="svelte-11h11dx">Change your password here. Click save when you&#39;re done.</p> <fieldset class="svelte-1mjlia9" data-svelte-h="svelte-za3nem"><label for="new" class="svelte-1mjlia9">New password</label> <input id="new" type="password" class="svelte-1mjlia9"></fieldset> <div class="actions svelte-1mjlia9" data-svelte-h="svelte-1rizfbm"><button class="svelte-1mjlia9">Save changes</button></div></div> <div${spread([escape_object($content("tab4")), { class: "content" }], { classes: "svelte-1mjlia9" })}><p class="description svelte-1mjlia9" data-svelte-h="svelte-1kiaa9d">Change your settings here. Click save when you&#39;re done.</p> <fieldset class="svelte-1mjlia9" data-svelte-h="svelte-oyvdcb"><label for="new" class="svelte-1mjlia9">New email</label> <input id="new" type="password" class="svelte-1mjlia9"></fieldset> <div class="actions svelte-1mjlia9" data-svelte-h="svelte-1rizfbm"><button class="svelte-1mjlia9">Save changes</button></div></div></div> </div>`;
});
export {
  Tailwind as default
};
