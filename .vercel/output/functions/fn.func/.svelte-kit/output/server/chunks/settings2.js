import { e as effect, h as hiddenAction } from "./builder.js";
import { a as isBrowser } from "./is.js";
import { a as addEventListener } from "./event.js";
import { s as sleep } from "./sleep.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { n as noop } from "./callbacks.js";
import { r as readable, d as derived, w as writable } from "./index2.js";
import "./clickOutside.js";
import { u as usePopper } from "./popper.js";
import { t as tick } from "./portal.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  open: false
};
function createPopover(args) {
  const options = { ...defaults, ...args };
  const positioning = readable(options.positioning);
  const arrowSize = readable(options.arrowSize);
  const open = writable(options.open);
  const activeTrigger = writable(null);
  const ids = {
    content: generateId()
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
      let unsubPopper = noop;
      const unsubDerived = effect(
        [open, activeTrigger, positioning],
        ([$open, $activeTrigger, $positioning]) => {
          unsubPopper();
          if ($open && $activeTrigger) {
            tick().then(() => {
              const popper = usePopper(node, {
                anchorElement: $activeTrigger,
                open,
                options: {
                  floating: $positioning
                }
              });
              if (popper && popper.destroy) {
                unsubPopper = popper.destroy;
              }
            });
          }
        }
      );
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
        }
      };
    }
  };
  const trigger = {
    ...derived([open], ([$open]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": ids.content
      };
    }),
    action: (node) => {
      const unsub = addEventListener(node, "click", () => {
        open.update((prev) => {
          const isOpen = !prev;
          if (isOpen) {
            activeTrigger.set(node);
          } else {
            activeTrigger.set(null);
          }
          return isOpen;
        });
      });
      return {
        destroy: unsub
      };
    }
  };
  const arrow = derived(arrowSize, ($arrowSize) => ({
    "data-arrow": true,
    style: styleToString({
      position: "absolute",
      width: `var(--arrow-size, ${$arrowSize}px)`,
      height: `var(--arrow-size, ${$arrowSize}px)`
    })
  }));
  const close = hiddenAction({
    type: "button",
    action: (node) => {
      const unsub = addEventListener(node, "click", () => {
        open.set(false);
      });
      return {
        destroy: unsub
      };
    }
  });
  effect([open, activeTrigger], ([$open, $activeTrigger]) => {
    if (!isBrowser)
      return;
    if (!$open && $activeTrigger && isBrowser) {
      sleep(1).then(() => $activeTrigger.focus());
    }
  });
  return { trigger, open, content, arrow, close };
}
const Settings2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 7h-9m3 10H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Settings2 as S,
  createPopover as c
};
