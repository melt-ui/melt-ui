import { u as usePopper } from "./popper.js";
import { d as derivedWithUnsubscribe, b as builder, c as createElHelpers, e as effect } from "./builder.js";
import { b as isHTMLElement } from "./is.js";
import { a as addEventListener } from "./event.js";
import { s as styleToString } from "./style.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks, n as noop } from "./callbacks.js";
import { g as getNextFocusable, a as getPreviousFocusable } from "./rovingFocus.js";
import { w as writable } from "./index2.js";
import { g as get_store_value } from "./utils.js";
import { t as tick } from "./portal.js";
import { c as createMenuBuilder, s as setMeltMenuAttribute, h as handleMenuNavigation, a as handleTabNavigation, g as getMenuItems, b as applyAttrsIfDisabled, d as clearTimerStore } from "./create9.js";
const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const defaults = {
  arrowSize: 8,
  positioning: {
    placement: "bottom-start"
  },
  preventScroll: true
};
const { name, selector } = createElHelpers("context-menu");
function createContextMenu(args) {
  const withDefaults = { ...defaults, ...args };
  const rootOptions = writable(withDefaults);
  const rootOpen = writable(false);
  const rootActiveTrigger = writable(null);
  const nextFocusable = writable(null);
  const prevFocusable = writable(null);
  const {
    item,
    checkboxItem,
    arrow,
    createSubMenu,
    createMenuRadioGroup,
    rootIds,
    separator,
    handleTypeaheadSearch
  } = createMenuBuilder({
    rootOpen,
    rootActiveTrigger,
    rootOptions,
    nextFocusable,
    prevFocusable,
    disableFocusFirstItem: true,
    disableTriggerRefocus: true,
    selector: "context-menu"
  });
  const point = writable({ x: 0, y: 0 });
  const virtual = derivedWithUnsubscribe([point], ([$point]) => {
    return {
      getBoundingClientRect: () => DOMRect.fromRect({
        width: 0,
        height: 0,
        ...$point
      })
    };
  });
  const longPressTimer = writable(0);
  const menu = builder(name(), {
    stores: rootOpen,
    returned: ($rootOpen) => {
      return {
        role: "menu",
        hidden: $rootOpen ? void 0 : true,
        style: styleToString({
          display: $rootOpen ? void 0 : "none"
        }),
        id: rootIds.menu,
        "aria-labelledby": rootIds.trigger,
        "data-state": $rootOpen ? "open" : "closed",
        tabindex: -1
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubDerived = effect(
        [rootOpen, rootActiveTrigger, rootOptions],
        ([$rootOpen, $rootActiveTrigger, $rootOptions]) => {
          unsubPopper();
          if ($rootOpen && $rootActiveTrigger) {
            tick().then(() => {
              setMeltMenuAttribute(node, selector);
              const $virtual = get_store_value(virtual);
              const popper = usePopper(node, {
                anchorElement: $virtual,
                open: rootOpen,
                options: {
                  floating: $rootOptions.positioning,
                  clickOutside: {
                    handler: (e) => {
                      if (e.defaultPrevented)
                        return;
                      const target = e.target;
                      if (!isHTMLElement(target))
                        return;
                      if (target.id === rootIds.trigger && e.button === 0) {
                        rootOpen.set(false);
                        return;
                      }
                      if (target.id !== rootIds.trigger && !target.closest(selector())) {
                        rootOpen.set(false);
                      }
                    }
                  }
                }
              });
              if (popper && popper.destroy) {
                unsubPopper = popper.destroy;
              }
            });
          }
        }
      );
      const unsubEvents = executeCallbacks(
        addEventListener(node, "keydown", (e) => {
          const target = e.target;
          if (!isHTMLElement(target))
            return;
          const menuElement = e.currentTarget;
          if (!isHTMLElement(menuElement))
            return;
          const isKeyDownInside = target.closest("[role='menu']") === menuElement;
          if (!isKeyDownInside)
            return;
          if (FIRST_LAST_KEYS.includes(e.key)) {
            handleMenuNavigation(e);
          }
          if (e.key === kbd.TAB) {
            e.preventDefault();
            rootActiveTrigger.set(null);
            rootOpen.set(false);
            handleTabNavigation(e, nextFocusable, prevFocusable);
            return;
          }
          const isCharacterKey = e.key.length === 1;
          const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
          if (!isModifierKey && isCharacterKey) {
            handleTypeaheadSearch(e.key, getMenuItems(menuElement));
          }
        })
      );
      return {
        destroy() {
          unsubDerived();
          unsubEvents();
          unsubPopper();
        }
      };
    }
  });
  const trigger = builder(name("trigger"), {
    stores: rootOpen,
    returned: ($rootOpen) => {
      return {
        "aria-controls": rootIds.menu,
        "aria-expanded": $rootOpen,
        "data-state": $rootOpen ? "open" : "closed",
        id: rootIds.trigger,
        style: styleToString({
          WebkitTouchCallout: "none"
        })
      };
    },
    action: (node) => {
      applyAttrsIfDisabled(node);
      const handleOpen = (e) => {
        point.set({
          x: e.clientX,
          y: e.clientY
        });
        nextFocusable.set(getNextFocusable(node));
        prevFocusable.set(getPreviousFocusable(node));
        rootActiveTrigger.set(node);
        rootOpen.set(true);
      };
      const unsubTimer = () => {
        clearTimerStore(longPressTimer);
      };
      const unsub = executeCallbacks(
        addEventListener(node, "contextmenu", (e) => {
          clearTimerStore(longPressTimer);
          handleOpen(e);
          e.preventDefault();
        }),
        addEventListener(node, "pointerdown", (e) => {
          if (!isTouchOrPen(e))
            return;
          clearTimerStore(longPressTimer);
          longPressTimer.set(window.setTimeout(() => handleOpen(e), 700));
        }),
        addEventListener(node, "pointermove", (e) => {
          if (!isTouchOrPen(e))
            return;
          clearTimerStore(longPressTimer);
        }),
        addEventListener(node, "pointercancel", (e) => {
          if (!isTouchOrPen(e))
            return;
          clearTimerStore(longPressTimer);
        }),
        addEventListener(node, "pointerup", (e) => {
          if (!isTouchOrPen(e))
            return;
          clearTimerStore(longPressTimer);
        })
      );
      return {
        destroy() {
          unsubTimer();
          unsub();
        }
      };
    }
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
function isTouchOrPen(e) {
  return e.pointerType !== "mouse";
}
export {
  createContextMenu as c
};
