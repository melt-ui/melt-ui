import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import "clsx";
import "shiki-es";
/* empty css                     */import "../../chunks/clickOutside.js";
import "../../chunks/select.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../chunks/button.js";
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="grid min-h-full w-full place-items-center px-6 py-24 sm:py-32 lg:px-8"><div class="text-center"><p class="font-semibold text-magnum-500" data-svelte-h="svelte-1hqadp1">404</p> <h1 class="mt-4 text-4xl font-bold tracking-tight" data-svelte-h="svelte-14gtzom">Page not found</h1> <div class="mt-10 flex items-center justify-center gap-x-6">${validate_component(Button, "Button").$$render($$result, { href: "/docs", class: "mt-4" }, {}, {
    default: () => {
      return `Back to docs`;
    }
  })}</div></div></main>`;
});
export {
  Error as default
};
