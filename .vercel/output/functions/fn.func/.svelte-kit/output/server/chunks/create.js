import "./clickOutside.js";
import { b as builder, e as effect, c as createElHelpers } from "./builder.js";
import { a as isBrowser } from "./is.js";
import { a as addEventListener } from "./event.js";
import { s as sleep } from "./sleep.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { n as noop } from "./callbacks.js";
import { r as removeScroll } from "./scroll.js";
import { w as writable } from "./index2.js";
import { c as createFocusTrap } from "./focusTrap.js";
import { u as usePortal } from "./portal.js";
import { g as get_store_value } from "./utils.js";
const { name } = createElHelpers("dialog");
const defaults = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog"
};
function createDialog(args = {}) {
  const withDefaults = { ...defaults, ...args };
  const options = writable({ ...withDefaults });
  const activeTrigger = writable(null);
  const ids = {
    content: generateId(),
    title: generateId(),
    description: generateId()
  };
  const open = writable(false);
  const trigger = builder(name("trigger"), {
    stores: open,
    returned: ($open) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "aria-controls": ids.content,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = addEventListener(node, "click", (e) => {
        const el = e.currentTarget;
        open.set(true);
        activeTrigger.set(el);
      });
      return {
        destroy: unsub
      };
    }
  });
  const overlay = builder(name("overlay"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        hidden: $open ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $open ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed"
      };
    }
  });
  const content = builder(name("content"), {
    stores: open,
    returned: ($open) => {
      return {
        id: ids.content,
        role: "dialog",
        "aria-describedby": ids.description,
        "aria-labelledby": ids.title,
        "data-state": $open ? "open" : "closed",
        tabindex: -1,
        hidden: $open ? void 0 : true
      };
    },
    action: (node) => {
      let unsub = noop;
      const { useFocusTrap, activate, deactivate } = createFocusTrap({
        immediate: false,
        escapeDeactivates: false,
        allowOutsideClick: (e) => {
          e.preventDefault();
          const $options = get_store_value(options);
          if ($options.closeOnOutsideClick) {
            open.set(false);
          }
          return false;
        },
        returnFocusOnDeactivate: false,
        fallbackFocus: node
      });
      const ac = useFocusTrap(node);
      if (ac && ac.destroy) {
        unsub = ac.destroy;
      } else {
        unsub = deactivate;
      }
      effect([open], ([$open]) => {
        if (node.hidden || !$open) {
          deactivate();
        } else {
          activate();
        }
      });
      return {
        destroy: unsub
      };
    }
  });
  const title = builder(name("title"), {
    returned: () => ({
      id: ids.title
    })
  });
  const description = builder(name("description"), {
    returned: () => ({
      id: ids.description
    })
  });
  const close = builder(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = addEventListener(node, "click", () => {
        open.set(false);
      });
      return {
        destroy: unsub
      };
    }
  });
  effect([open, options], ([$open, $options]) => {
    const unsubs = [];
    if ($options.closeOnEscape && $open) {
      unsubs.push(
        addEventListener(document, "keydown", (e) => {
          if (e.key === "Escape") {
            open.set(false);
          }
        })
      );
    }
    if ($options.preventScroll && $open)
      unsubs.push(removeScroll());
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  effect([open, activeTrigger], ([$open, $activeTrigger]) => {
    if (!isBrowser)
      return;
    if (!$open && $activeTrigger && isBrowser) {
      sleep(1).then(() => $activeTrigger.focus());
    }
  });
  return {
    options,
    open,
    trigger,
    overlay,
    portal: usePortal,
    content,
    title,
    description,
    close
  };
}
export {
  createDialog as c
};
