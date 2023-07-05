import { u as usePopper } from "./popper.js";
import { e as effect } from "./builder.js";
import { b as isHTMLElement, a as isBrowser } from "./is.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { s as sleep } from "./sleep.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks, n as noop } from "./callbacks.js";
import { r as removeScroll } from "./scroll.js";
import { h as handleRovingFocus, g as getNextFocusable, a as getPreviousFocusable } from "./rovingFocus.js";
import { c as createTypeaheadSearch } from "./typeahead.js";
import { g as get_store_value } from "./utils.js";
import { t as tick } from "./portal.js";
import { w as writable, d as derived } from "./index2.js";
import { c as createSeparator } from "./create2.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const defaults = {
  arrowSize: 8,
  required: false,
  disabled: false,
  positioning: {
    placement: "bottom",
    sameWidth: true
  },
  preventScroll: true,
  loop: false
};
function createSelect(args) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "value", "label"));
  const open = writable(false);
  const value = writable(withDefaults.value ?? null);
  const label = writable(withDefaults.label ?? null);
  const activeTrigger = writable(null);
  const nextFocusable = writable(null);
  const prevFocusable = writable(null);
  const isUsingKeyboard = writable(false);
  const ids = {
    menu: generateId(),
    trigger: generateId()
  };
  const menu = {
    ...derived([open], ([$open]) => {
      return {
        hidden: $open ? void 0 : true,
        style: styleToString({
          display: $open ? void 0 : "none"
        }),
        id: ids.menu,
        "aria-labelledby": ids.trigger
      };
    }),
    action: (node) => {
      let unsubPopper = noop;
      const unsubDerived = effect(
        [open, activeTrigger, options],
        ([$open, $activeTrigger, $options]) => {
          unsubPopper();
          if ($open && $activeTrigger) {
            tick().then(() => {
              const popper = usePopper(node, {
                anchorElement: $activeTrigger,
                open,
                options: {
                  floating: $options.positioning
                }
              });
              if (popper && popper.destroy) {
                unsubPopper = popper.destroy;
              }
            });
          }
        }
      );
      const unsubEventListeners = executeCallbacks(
        addEventListener(node, "keydown", (e) => {
          const menuElement = e.currentTarget;
          if (!isHTMLElement(menuElement))
            return;
          const target = e.target;
          if (!isHTMLElement(target))
            return;
          const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
          const isCharacterKey = e.key.length === 1;
          if (e.key === kbd.TAB) {
            e.preventDefault();
            activeTrigger.set(null);
            open.set(false);
            handleTabNavigation(e);
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            if (menuElement === target) {
              const selectedOption = getSelectedOption(menuElement);
              if (isHTMLElement(selectedOption)) {
                handleRovingFocus(selectedOption);
                return;
              }
            }
            handleMenuNavigation(e);
          }
          if (!isModifierKey && isCharacterKey) {
            handleTypeaheadSearch(e.key, getOptions(node));
          }
        })
      );
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
          unsubEventListeners();
        }
      };
    }
  };
  const trigger = {
    ...derived([open, options], ([$open, $options]) => {
      return {
        role: "combobox",
        "aria-autocomplete": "none",
        "aria-controls": ids.menu,
        "aria-expanded": $open,
        "aria-required": $options.required,
        "data-state": $open ? "open" : "closed",
        "data-disabled": $options.disabled ? true : void 0,
        "data-melt-part": "trigger",
        disabled: $options.disabled,
        id: ids.trigger,
        tabindex: 0
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const $options = get_store_value(options);
          if ($options.disabled) {
            e.preventDefault();
            return;
          }
          const $open = get_store_value(open);
          const triggerElement = e.currentTarget;
          if (!isHTMLElement(triggerElement))
            return;
          open.update((prev) => {
            const isOpen = !prev;
            if (isOpen) {
              nextFocusable.set(getNextFocusable(triggerElement));
              prevFocusable.set(getPreviousFocusable(triggerElement));
              activeTrigger.set(triggerElement);
            } else {
              activeTrigger.set(null);
            }
            return isOpen;
          });
          if (!$open)
            e.preventDefault();
        }),
        addEventListener(node, "keydown", (e) => {
          const triggerElement = e.currentTarget;
          if (!isHTMLElement(triggerElement))
            return;
          if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
            if (e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
              e.preventDefault();
            }
            open.update((prev) => {
              const isOpen = !prev;
              if (isOpen) {
                e.preventDefault();
                nextFocusable.set(getNextFocusable(triggerElement));
                prevFocusable.set(getPreviousFocusable(triggerElement));
                activeTrigger.set(triggerElement);
              } else {
                activeTrigger.set(null);
              }
              return isOpen;
            });
            const menu2 = document.getElementById(ids.menu);
            if (!isHTMLElement(menu2))
              return;
            const selectedOption = menu2.querySelector("[data-selected]");
            if (isHTMLElement(selectedOption)) {
              handleRovingFocus(selectedOption);
              return;
            }
            const options2 = getOptions(menu2);
            if (!options2.length)
              return;
            const nextFocusedElement = options2[0];
            if (!isHTMLElement(nextFocusedElement))
              return;
            handleRovingFocus(nextFocusedElement);
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  };
  const { root: separator } = createSeparator({
    decorative: true
  });
  const createGroup = () => {
    const groupId = generateId();
    const group = {
      role: "group",
      "aria-labelledby": groupId
    };
    const label2 = {
      id: groupId
    };
    return {
      group,
      label: label2
    };
  };
  const arrow = derived(options, ($options) => ({
    "data-arrow": true,
    style: styleToString({
      position: "absolute",
      width: `var(--arrow-size, ${$options.arrowSize}px)`,
      height: `var(--arrow-size, ${$options.arrowSize}px)`
    })
  }));
  const option = {
    ...derived(value, ($value) => {
      return (args2) => {
        return {
          role: "option",
          "aria-selected": $value === args2?.value,
          "data-selected": $value === args2?.value ? "" : void 0,
          "data-value": args2.value,
          "data-label": args2.label ?? void 0,
          "data-disabled": args2.disabled ? "" : void 0,
          tabindex: -1
        };
      };
    }),
    action: (node) => {
      const getElArgs = () => {
        const value2 = node.getAttribute("data-value");
        const label2 = node.getAttribute("data-label");
        const disabled = node.hasAttribute("data-disabled");
        return {
          value: value2,
          label: label2 ?? node.textContent ?? null,
          disabled: disabled ? true : false
        };
      };
      const unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const args2 = getElArgs();
          if (args2.disabled) {
            e.preventDefault();
            return;
          }
        }),
        addEventListener(node, "click", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          const args2 = getElArgs();
          if (args2.disabled) {
            e.preventDefault();
            return;
          }
          handleRovingFocus(itemElement);
          value.set(args2.value);
          label.set(args2.label);
          open.set(false);
        }),
        addEventListener(node, "keydown", (e) => {
          const $typed = get_store_value(typed);
          const isTypingAhead = $typed.length > 0;
          if (isTypingAhead && e.key === kbd.SPACE) {
            e.preventDefault();
            return;
          }
          if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
            e.preventDefault();
            const args2 = getElArgs();
            node.setAttribute("data-selected", "");
            value.set(args2.value);
            label.set(args2.label);
            open.set(false);
          }
        }),
        addEventListener(node, "pointermove", (e) => {
          const args2 = getElArgs();
          if (args2.disabled) {
            e.preventDefault();
            return;
          }
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (args2.disabled) {
            const menuElement = document.getElementById(ids.menu);
            if (!isHTMLElement(menuElement))
              return;
            handleRovingFocus(menuElement);
          }
          onOptionPointerMove(e);
        }),
        addEventListener(node, "pointerleave", (e) => {
          if (!isMouse(e))
            return;
          onOptionLeave();
        }),
        addEventListener(node, "focusin", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          itemElement.setAttribute("data-highlighted", "");
        }),
        addEventListener(node, "focusout", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          itemElement.removeAttribute("data-highlighted");
        })
      );
      return {
        destroy: unsub
      };
    }
  };
  const { typed, handleTypeaheadSearch } = createTypeaheadSearch();
  effect([open, activeTrigger], ([$open, $activeTrigger]) => {
    const unsubs = [];
    if (!isBrowser)
      return;
    const $options = get_store_value(options);
    if ($open && $options.preventScroll) {
      unsubs.push(removeScroll());
    }
    sleep(1).then(() => {
      const menuEl = document.getElementById(ids.menu);
      if (menuEl && $open && get_store_value(isUsingKeyboard)) {
        const selectedOption = getSelectedOption(menuEl);
        if (!isHTMLElement(selectedOption)) {
          const firstOption = getFirstOption(menuEl);
          if (!isHTMLElement(firstOption))
            return;
          handleRovingFocus(firstOption);
        } else {
          handleRovingFocus(selectedOption);
        }
      } else if (menuEl && $open) {
        handleRovingFocus(menuEl);
      } else if ($activeTrigger) {
        handleRovingFocus($activeTrigger);
      }
    });
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  const isSelected = derived([value], ([$value]) => {
    return (value2) => {
      return $value === value2;
    };
  });
  const input = derived([value, options], ([$value, $options]) => {
    return {
      type: "hidden",
      name: $options.name,
      value: $value,
      "aria-hidden": true,
      hidden: true,
      tabIndex: -1,
      required: $options.required,
      disabled: $options.disabled,
      style: styleToString({
        position: "absolute",
        opacity: 0,
        "pointer-events": "none",
        margin: 0,
        transform: "translateX(-100%)"
      })
    };
  });
  function getOptions(element) {
    return Array.from(element.querySelectorAll('[role="option"]'));
  }
  function isMouse(e) {
    return e.pointerType === "mouse";
  }
  function getFirstOption(menuElement) {
    return menuElement.querySelector('[role="option"]');
  }
  function getSelectedOption(menuElement) {
    return menuElement.querySelector("[data-selected]");
  }
  function onOptionPointerMove(e) {
    if (!isMouse(e))
      return;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget))
      return;
    handleRovingFocus(currentTarget);
  }
  function onOptionLeave() {
    const menuElement = document.getElementById(ids.menu);
    if (!isHTMLElement(menuElement))
      return;
    handleRovingFocus(menuElement);
  }
  function handleMenuNavigation(e) {
    e.preventDefault();
    const currentFocusedItem = document.activeElement;
    if (!isHTMLElement(currentFocusedItem))
      return;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget))
      return;
    const items = getOptions(currentTarget);
    if (!items.length)
      return;
    const candidateNodes = items.filter((opt) => {
      if (opt.hasAttribute("data-disabled")) {
        return false;
      }
      if (opt.getAttribute("disabled") === "true") {
        return false;
      }
      return true;
    });
    const currentIndex = candidateNodes.indexOf(currentFocusedItem);
    let nextIndex;
    const $options = get_store_value(options);
    const loop = $options.loop;
    switch (e.key) {
      case kbd.ARROW_DOWN:
        nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : loop ? 0 : currentIndex;
        break;
      case kbd.ARROW_UP:
        nextIndex = currentIndex > 0 ? currentIndex - 1 : loop ? candidateNodes.length - 1 : 0;
        break;
      case kbd.HOME:
        nextIndex = 0;
        break;
      case kbd.END:
        nextIndex = candidateNodes.length - 1;
        break;
      default:
        return;
    }
    handleRovingFocus(candidateNodes[nextIndex]);
  }
  function handleTabNavigation(e) {
    if (e.shiftKey) {
      const $prevFocusable = get_store_value(prevFocusable);
      if ($prevFocusable) {
        e.preventDefault();
        $prevFocusable.focus();
        prevFocusable.set(null);
      }
    } else {
      const $nextFocusable = get_store_value(nextFocusable);
      if ($nextFocusable) {
        e.preventDefault();
        $nextFocusable.focus();
        nextFocusable.set(null);
      }
    }
  }
  return {
    trigger,
    menu,
    open,
    option,
    value,
    label,
    arrow,
    isSelected,
    options,
    input,
    separator,
    createGroup
  };
}
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Chevron_down as C,
  createSelect as c
};
