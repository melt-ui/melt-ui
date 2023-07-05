import { u as useClickOutside } from "./clickOutside.js";
import { u as useFloating } from "./floating.js";
import { c as createFocusTrap } from "./focusTrap.js";
import { b as isHTMLElement } from "./is.js";
import { a as addEventListener } from "./event.js";
import { k as kbd } from "./keyboard.js";
import { n as noop, e as executeCallbacks } from "./callbacks.js";
import { u as usePortal } from "./portal.js";
const defaultConfig = {
  floating: {},
  focusTrap: {},
  clickOutside: {},
  portal: "body"
};
const usePopper = (popperElement, args) => {
  const { anchorElement, open, options } = args ?? {};
  if (!(open && anchorElement && options))
    return { destroy: noop };
  const opts = { ...defaultConfig, ...options };
  const callbacks = [];
  if (options.portal !== null) {
    const portal = usePortal(popperElement, options.portal);
    if (portal?.destroy) {
      callbacks.push(portal.destroy);
    }
  }
  callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);
  if (options.focusTrap !== null) {
    const { useFocusTrap } = createFocusTrap({
      immediate: true,
      escapeDeactivates: false,
      allowOutsideClick: true,
      returnFocusOnDeactivate: false,
      fallbackFocus: popperElement,
      ...opts.focusTrap
    });
    const usedFocusTrap = useFocusTrap(popperElement);
    if (usedFocusTrap?.destroy) {
      callbacks.push(usedFocusTrap.destroy);
    }
  }
  if (options.clickOutside !== null) {
    callbacks.push(
      useClickOutside(popperElement, {
        enabled: open,
        handler: (e) => {
          if (e.defaultPrevented)
            return;
          if (isHTMLElement(anchorElement) && !anchorElement.contains(e.target)) {
            open.set(false);
            anchorElement.focus();
          }
        },
        ...opts.clickOutside
      }).destroy
    );
  }
  callbacks.push(
    addEventListener(popperElement, "keydown", (e) => {
      if (e.defaultPrevented)
        return;
      const event = e;
      switch (event.key) {
        case kbd.ESCAPE:
          open.set(false);
          break;
      }
    })
  );
  const unsubscribe = executeCallbacks(...callbacks);
  return {
    destroy() {
      unsubscribe();
    }
  };
};
export {
  usePopper as u
};
