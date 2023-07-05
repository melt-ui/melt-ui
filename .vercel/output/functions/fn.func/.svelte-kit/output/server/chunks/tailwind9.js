import { g as get_store_value, s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
import "./clickOutside.js";
import { b as builder, e as effect, c as createElHelpers } from "./builder.js";
import { a as addEventListener } from "./event.js";
import { a as isBrowser, b as isHTMLElement, d as isTouch } from "./is.js";
import { s as sleep } from "./sleep.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { e as executeCallbacks, n as noop } from "./callbacks.js";
import { d as derived, w as writable } from "./index2.js";
import { u as usePopper } from "./popper.js";
import { u as usePortal, t as tick } from "./portal.js";
function getTabbableNodes(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode())
    nodes.push(walker.currentNode);
  return nodes;
}
const { name } = createElHelpers("hover-card");
const defaults = {
  defaultOpen: false,
  openDelay: 700,
  closeDelay: 300,
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  closeOnOutsideClick: true
};
function createHoverCard(args = {}) {
  const argsWithDefaults = { ...defaults, ...args };
  const options = writable(argsWithDefaults);
  const open = writable(argsWithDefaults.defaultOpen);
  const hasSelection = writable(false);
  const isPointerDownOnContent = writable(false);
  const containSelection = writable(false);
  const ids = {
    content: generateId(),
    trigger: generateId()
  };
  let timeout = null;
  let originalBodyUserSelect;
  const handleOpen = derived(options, ($options) => {
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
  const handleClose = derived(
    [options, isPointerDownOnContent, hasSelection],
    ([$options, $isPointerDownOnContent, $hasSelection]) => {
      return () => {
        if (timeout) {
          window.clearTimeout(timeout);
          timeout = null;
        }
        if (!$isPointerDownOnContent && !$hasSelection) {
          timeout = window.setTimeout(() => {
            open.set(false);
          }, $options.closeDelay);
        }
      };
    }
  );
  const trigger = builder(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": ids.content,
        "data-melt-hover-card-trigger": "",
        id: ids.trigger
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "pointerenter", (e) => {
          if (isTouch(e))
            return;
          get_store_value(handleOpen)();
        }),
        addEventListener(node, "pointerleave", (e) => {
          if (isTouch(e))
            return;
          get_store_value(handleClose)();
        }),
        addEventListener(node, "focus", () => get_store_value(handleOpen)()),
        addEventListener(node, "blur", () => get_store_value(handleClose)()),
        addEventListener(node, "touchstart", (e) => {
          e.preventDefault();
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const content = builder(name("content"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        hidden: $open ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $open ? void 0 : "none",
          userSelect: "text",
          WebkitUserSelect: "text"
        }),
        "data-melt-hover-card-content": "",
        id: ids.content
      };
    },
    action: (node) => {
      let unsub = noop;
      const unsubTimers = () => {
        if (timeout) {
          window.clearTimeout(timeout);
        }
      };
      const portalReturn = usePortal(node);
      let unsubPopper = noop;
      const unsubOpen = open.subscribe(($open) => {
        if ($open) {
          tick().then(() => {
            const triggerEl = document.getElementById(ids.trigger);
            if (!triggerEl || node.hidden)
              return;
            const $options = get_store_value(options);
            const popper = usePopper(node, {
              anchorElement: triggerEl,
              open,
              options: {
                floating: $options.positioning,
                focusTrap: null,
                clickOutside: !$options.closeOnOutsideClick ? null : void 0
              }
            });
            if (popper && popper.destroy) {
              unsubPopper = popper.destroy;
            }
          });
        } else {
          unsubPopper();
        }
      });
      unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const currentTarget = e.currentTarget;
          if (!isHTMLElement(currentTarget))
            return;
          const target = e.target;
          if (!isHTMLElement(target))
            return;
          if (currentTarget.contains(target)) {
            containSelection.set(true);
          }
          hasSelection.set(false);
          isPointerDownOnContent.set(true);
        }),
        addEventListener(node, "pointerenter", (e) => {
          if (isTouch(e))
            return;
          get_store_value(handleOpen)();
        }),
        addEventListener(node, "pointerleave", (e) => {
          if (isTouch(e))
            return;
          get_store_value(handleClose)();
        }),
        addEventListener(node, "focusout", (e) => {
          e.preventDefault();
        }),
        portalReturn && portalReturn.destroy ? portalReturn.destroy : noop,
        unsubOpen
      );
      return {
        destroy() {
          unsub();
          unsubPopper();
          unsubTimers();
        }
      };
    }
  });
  const arrow = builder(name("arrow"), {
    stores: options,
    returned: ($options) => ({
      "data-melt-hover-card-arrow": "",
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$options.arrowSize}px)`,
        height: `var(--arrow-size, ${$options.arrowSize}px)`
      })
    })
  });
  effect([containSelection], ([$containSelection]) => {
    if (!isBrowser)
      return;
    if ($containSelection) {
      const body = document.body;
      const contentElement = document.getElementById(ids.content);
      if (!isHTMLElement(contentElement))
        return;
      originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
      const originalContentUserSelect = contentElement.style.userSelect || contentElement.style.webkitUserSelect;
      body.style.userSelect = "none";
      body.style.webkitUserSelect = "none";
      contentElement.style.userSelect = "text";
      contentElement.style.webkitUserSelect = "text";
      return () => {
        body.style.userSelect = originalBodyUserSelect;
        body.style.webkitUserSelect = originalBodyUserSelect;
        contentElement.style.userSelect = originalContentUserSelect;
        contentElement.style.webkitUserSelect = originalContentUserSelect;
      };
    }
  });
  effect([open], ([$open]) => {
    if (!isBrowser)
      return;
    if ($open) {
      const handlePointerUp = () => {
        containSelection.set(false);
        isPointerDownOnContent.set(false);
        sleep(1).then(() => {
          const isSelection = document.getSelection()?.toString() !== "";
          if (isSelection) {
            hasSelection.set(true);
          }
        });
      };
      document.addEventListener("pointerup", handlePointerUp);
      const contentElement = document.getElementById(ids.content);
      if (!isHTMLElement(contentElement))
        return;
      const tabbables = getTabbableNodes(contentElement);
      tabbables.forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
      return () => {
        document.removeEventListener("pointerup", handlePointerUp);
        hasSelection.set(false);
        isPointerDownOnContent.set(false);
      };
    }
  });
  return { trigger, open, content, arrow, options };
}
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".trigger.svelte-1lpdtxm{display:flex;height:3rem;width:3rem;align-items:center;justify-content:center;border-radius:9999px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-1lpdtxm:hover{background-color:rgb(255 255 255 / 0.9)\n}.trigger.svelte-1lpdtxm:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let $arrow, $$unsubscribe_arrow;
  const { trigger, content, open, arrow } = createHoverCard();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_arrow = subscribe(arrow, (value) => $arrow = value);
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_content();
  $$unsubscribe_arrow();
  return `<div class="flex w-full items-center justify-center"><a${spread(
    [
      { class: "trigger" },
      {
        href: "https://github.com/melt-ui/melt-ui"
      },
      { target: "_blank" },
      { rel: "noreferrer" },
      escape_object($trigger)
    ],
    { classes: "svelte-1lpdtxm" }
  )}><img src="/logo-mark.svg" alt="Melt UI Logo" class="h-full w-full rounded-full bg-neutral-900 object-contain p-2"> <span class="sr-only" data-svelte-h="svelte-ts639p">Open Melt UI Details</span></a> ${$open ? `<div${spread(
    [
      escape_object($content),
      {
        class: "z-10 rounded-md bg-white shadow-sm"
      }
    ],
    { classes: "svelte-1lpdtxm" }
  )}><div class="w-[300px] rounded-md bg-white p-5 shadow-sm" data-svelte-h="svelte-12y9aoj"><div class="flex flex-col gap-2"><img src="/logo-mark.svg" alt="Melt UI Logo" class="object-fit block h-14 w-14 rounded-full bg-neutral-900 p-2"> <div class="flex flex-col gap-4"><div><div class="font-bold text-neutral-900">Melt UI</div> <div class="text-neutral-400">melt-ui/melt-ui</div></div></div> <div class="m-0 text-neutral-700">A set of accessible, unstyled component builders for Svelte &amp; SvelteKit. Open source.</div> <div class="flex gap-4"><div class="flex gap-1"><div class="text-neutral-900">250</div> <div class="text-neutral-400">Stars</div></div> <div class="flex gap-1"><div class="text-neutral-900">23</div> <div class="text-neutral-400">Forks</div></div></div></div></div> <div${spread([escape_object($arrow)], { classes: "svelte-1lpdtxm" })}></div></div>` : ``} </div>`;
});
export {
  Tailwind as default
};
