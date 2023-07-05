import { c as create_ssr_component } from "./ssr.js";
import "clsx";
import "shiki-es";
/* empty css          */const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `   ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as L
};
