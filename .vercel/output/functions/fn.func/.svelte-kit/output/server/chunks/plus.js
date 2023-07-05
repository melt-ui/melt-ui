import { g as get_store_value } from "./utils.js";
import { u as usePortal, t as tick } from "./portal.js";
import { w as writable, d as derived } from "./index2.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { e as executeCallbacks, n as noop } from "./callbacks.js";
import "./clickOutside.js";
import { u as useFloating } from "./floating.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  open: false,
  closeOnPointerDown: true,
  openDelay: 1e3,
  closeDelay: 500
};
function createTooltip(args) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "open"));
  const open = writable(withDefaults.open);
  const ids = {
    content: generateId(),
    trigger: generateId()
  };
  let timeout = null;
  const openTooltip = derived(options, ($options) => {
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      timeout = window.setTimeout(() => {
        open.set(true);
      }, $options.openDelay);
    };
  });
  const closeTooltip = derived(options, ($options) => {
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      timeout = window.setTimeout(() => {
        open.set(false);
      }, $options.closeDelay);
    };
  });
  const trigger = {
    ...derived([open], ([$open]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": ids.content,
        id: ids.trigger
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "mouseover", () => get_store_value(openTooltip)()),
        addEventListener(node, "mouseout", () => get_store_value(closeTooltip)()),
        addEventListener(node, "focus", () => open.set(true)),
        addEventListener(node, "blur", () => open.set(false)),
        addEventListener(node, "pointerdown", () => {
          const $options = get_store_value(options);
          if ($options.closeOnPointerDown) {
            open.set(false);
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  };
  const content = {
    ...derived([open], ([$open]) => {
      return {
        hidden: $open ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $open ? void 0 : "none"
        }),
        id: ids.content
      };
    }),
    action: (node) => {
      let unsub = noop;
      const portalReturn = usePortal(node);
      let unsubFloating = noop;
      const unsubOpen = open.subscribe(($open) => {
        if ($open) {
          tick().then(() => {
            const triggerEl = document.getElementById(ids.trigger);
            if (!triggerEl || node.hidden)
              return;
            const $options = get_store_value(options);
            const floatingReturn = useFloating(triggerEl, node, $options.positioning);
            unsubFloating = floatingReturn.destroy;
          });
        } else {
          unsubFloating();
        }
      });
      unsub = executeCallbacks(
        addEventListener(node, "mouseover", () => get_store_value(openTooltip)()),
        addEventListener(node, "mouseout", () => get_store_value(closeTooltip)()),
        portalReturn && portalReturn.destroy ? portalReturn.destroy : noop,
        unsubOpen
      );
      return {
        destroy() {
          unsub();
          unsubFloating();
        }
      };
    }
  };
  const arrow = derived(options, ($options) => ({
    "data-arrow": true,
    style: styleToString({
      position: "absolute",
      width: `var(--arrow-size, ${$options.arrowSize}px)`,
      height: `var(--arrow-size, ${$options.arrowSize}px)`
    })
  }));
  return { trigger, open, content, arrow, options };
}
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Plus as P,
  createTooltip as c
};
