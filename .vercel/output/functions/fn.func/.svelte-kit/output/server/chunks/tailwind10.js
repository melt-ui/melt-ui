import { c as create_ssr_component } from "./ssr.js";
import "./clickOutside.js";
import { c as createLabel } from "./create7.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createLabel();
  return `<form class="flex w-full items-center justify-center"><div class="flex flex-col items-start justify-center"><label for="email" class="mb-0.5 font-medium" data-melt-part="root" data-svelte-h="svelte-1l654ai"><span>Email</span></label> <input type="text" id="email" class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700" placeholder="vanilla@melt-ui.com"></div></form>`;
});
export {
  Tailwind as default
};
