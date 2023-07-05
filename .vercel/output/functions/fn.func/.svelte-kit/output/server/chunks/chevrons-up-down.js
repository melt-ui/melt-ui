import { b as builder, c as createElHelpers } from "./builder.js";
import { a as addEventListener } from "./event.js";
import { w as writable } from "./index2.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  open: false,
  disabled: false
};
const { name } = createElHelpers("collapsible");
function createCollapsible(args) {
  const options = { ...defaults, ...args };
  const disabled = writable(options.disabled);
  const open = writable(options.open);
  const root = builder(name(), {
    stores: open,
    returned: ($open) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": options.disabled ? true : "undefined"
    })
  });
  const trigger = builder(name("trigger"), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": $disabled ? true : void 0
    }),
    action: (node) => {
      const unsub = addEventListener(node, "click", () => {
        open.update(($open) => !$open);
      });
      return {
        destroy: unsub
      };
    }
  });
  const content = builder(name("content"), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": $disabled ? true : void 0,
      hidden: $open ? void 0 : true
    })
  });
  return {
    root,
    trigger,
    content,
    open,
    disabled
  };
}
const Chevrons_up_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 15l5 5l5-5M7 9l5-5l5 5"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Chevrons_up_down as C,
  createCollapsible as c
};
