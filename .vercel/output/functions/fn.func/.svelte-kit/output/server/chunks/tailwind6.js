import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import { c as createDialog } from "./create.js";
import { X } from "./x.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $overlay, $$unsubscribe_overlay;
  let $content, $$unsubscribe_content;
  let $close, $$unsubscribe_close;
  let $title, $$unsubscribe_title;
  let $description, $$unsubscribe_description;
  const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  $$unsubscribe_description = subscribe(description, (value) => $description = value);
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_overlay();
  $$unsubscribe_content();
  $$unsubscribe_close();
  $$unsubscribe_title();
  $$unsubscribe_description();
  return `<div><button${spread(
    [
      escape_object($trigger),
      {
        class: "inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75 focus:outline-none focus:ring focus:ring-magnum-400"
      }
    ],
    {}
  )}>Open Drawer</button> <div>${$open ? `<div${spread([escape_object($overlay), { class: "fixed inset-0 z-20 bg-black/50" }], {})}></div> <div${spread(
    [
      escape_object($content),
      {
        class: "fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-[25px] shadow-lg focus:outline-none"
      }
    ],
    {}
  )}><button${spread(
    [
      escape_object($close),
      {
        class: "absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2 focus:ring-magnum-400"
      }
    ],
    {}
  )}>${validate_component(X, "X").$$render($$result, {}, {}, {})}</button> <h2${spread(
    [
      escape_object($title),
      {
        class: "mb-0 text-lg font-medium text-black"
      }
    ],
    {}
  )}>Notifications</h2> <p${spread(
    [
      escape_object($description),
      {
        class: "mb-5 mt-[10px] leading-normal text-zinc-600"
      }
    ],
    {}
  )}>Check out your latest updates.</p> <section data-svelte-h="svelte-16syslf"><div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow"><h3 class="mb-3 text-base font-semibold">New invitation</h3> <p class="text-sm">You have been invited to join the <strong>Designers</strong> team.</p> <div class="mt-[25px] flex justify-end gap-4"><button class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-magnum-400">Reject</button> <button class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100 px-4 font-medium leading-none text-magnum-900 focus:outline-none focus:ring-2 focus:ring-magnum-400">Accept</button></div></div></section></div>` : ``}</div></div>`;
});
export {
  Tailwind as default
};
