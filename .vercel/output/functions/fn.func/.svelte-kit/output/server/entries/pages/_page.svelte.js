import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../chunks/ssr.js";
import { C as Copy } from "../../chunks/copy.js";
import "clsx";
import "shiki-es";
/* empty css                     */import "../../chunks/clickOutside.js";
import "../../chunks/select.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../chunks/button.js";
const Arrow_right = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7l-7 7"/>`}<!-- HTML_TAG_END --></svg>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".logo.svelte-4l3w7j{aspect-ratio:340/109;width:340px;max-width:100%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-s74bhs_START -->${$$result.title = `<title>Melt UI</title>`, ""}<!-- HEAD_svelte-s74bhs_END -->`, ""} <div class="relative grid grow place-items-center p-6"><div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"><div class="col-span-full flex flex-col gap-4 py-24"><div class="flex flex-col items-center"><img class="logo svelte-4l3w7j" src="/logo.svg" alt="Melt UI"> <button class="text-md group mt-8 flex items-center justify-between gap-4 break-keep rounded bg-zinc-800 px-4 py-3 text-left font-mono transition hover:bg-zinc-800/75 active:translate-y-0.5 sm:shrink" aria-label="Copy install command"><span data-svelte-h="svelte-1sku9f6">npm install <span class="whitespace-nowrap">@melt-ui/svelte</span></span> ${`<div>${validate_component(Copy, "Copy").$$render($$result, { class: "inline-block h-5 w-5 transition" }, {}, {})}</div>`}</button> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      href: "/docs",
      class: "mt-4 gap-4 sm:shrink"
    },
    {},
    {
      default: () => {
        return `Read the docs
					${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "inline-block h-5 w-5 text-white" }, {}, {})}`;
      }
    }
  )}</div></div></div> </div>`;
});
export {
  Page as default
};
