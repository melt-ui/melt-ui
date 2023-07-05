import { w as writable } from "./index2.js";
import { c as createMenuBuilder } from "./create9.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  arrowSize: 8,
  positioning: {
    placement: "bottom"
  },
  preventScroll: true
};
function createDropdownMenu(args) {
  const withDefaults = { ...defaults, ...args };
  const rootOptions = writable(withDefaults);
  const rootOpen = writable(false);
  const rootActiveTrigger = writable(null);
  const nextFocusable = writable(null);
  const prevFocusable = writable(null);
  const {
    trigger,
    menu,
    item,
    checkboxItem,
    arrow,
    createSubMenu,
    createMenuRadioGroup,
    separator
  } = createMenuBuilder({
    rootOptions,
    rootOpen,
    rootActiveTrigger,
    nextFocusable,
    prevFocusable,
    disableTriggerRefocus: true,
    selector: "dropdown-menu"
  });
  return {
    trigger,
    menu,
    open: rootOpen,
    item,
    checkboxItem,
    arrow,
    options: rootOptions,
    createSubMenu,
    createMenuRadioGroup,
    separator
  };
}
const Align_justify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Align_justify as A,
  createDropdownMenu as c
};
