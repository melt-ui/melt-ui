import { u as usePopper } from "./popper.js";
import { c as createElHelpers, d as derivedWithUnsubscribe, b as builder, e as effect } from "./builder.js";
import { a as isBrowser, b as isHTMLElement, c as isElementDisabled } from "./is.js";
import { a as addEventListener } from "./event.js";
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
const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
  rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT]
};
const SUB_CLOSE_KEYS = {
  ltr: [kbd.ARROW_LEFT],
  rtl: [kbd.ARROW_RIGHT]
};
const defaults = {
  arrowSize: 8,
  positioning: {
    placement: "bottom"
  },
  preventScroll: true
};
function createMenuBuilder(opts) {
  const { name, selector } = createElHelpers(opts.selector);
  const rootOptions = opts.rootOptions;
  const rootOpen = opts.rootOpen;
  const rootActiveTrigger = opts.rootActiveTrigger;
  const nextFocusable = opts.nextFocusable;
  const prevFocusable = opts.prevFocusable;
  const isUsingKeyboard = writable(false);
  const lastPointerX = writable(0);
  const pointerGraceIntent = writable(null);
  const pointerDir = writable("right");
  const pointerMovingToSubmenu = derivedWithUnsubscribe(
    [pointerDir, pointerGraceIntent],
    ([$pointerDir, $pointerGraceIntent]) => {
      return (e) => {
        const isMovingTowards = $pointerDir === $pointerGraceIntent?.side;
        return isMovingTowards && isPointerInGraceArea(e, $pointerGraceIntent?.area);
      };
    }
  );
  const { typed, handleTypeaheadSearch } = createTypeaheadSearch();
  const rootIds = {
    menu: generateId(),
    trigger: generateId()
  };
  const rootMenu = builder(name(), {
    stores: [rootOpen],
    returned: ([$rootOpen]) => {
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
              const popper = usePopper(node, {
                anchorElement: $rootActiveTrigger,
                open: rootOpen,
                options: {
                  floating: $rootOptions.positioning
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
          const isKeyDownInside = target.closest(selector()) === menuElement;
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
  const rootTrigger = builder(name("trigger"), {
    stores: [rootOpen],
    returned: ([$rootOpen]) => {
      return {
        "aria-controls": rootIds.menu,
        "aria-expanded": $rootOpen,
        "data-state": $rootOpen ? "open" : "closed",
        id: rootIds.trigger
      };
    },
    action: (node) => {
      applyAttrsIfDisabled(node);
      const unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const $rootOpen = get_store_value(rootOpen);
          const triggerElement = e.currentTarget;
          if (!isHTMLElement(triggerElement))
            return;
          rootOpen.update((prev) => {
            const isOpen = !prev;
            if (isOpen) {
              nextFocusable.set(getNextFocusable(triggerElement));
              prevFocusable.set(getPreviousFocusable(triggerElement));
              rootActiveTrigger.set(triggerElement);
            } else {
              rootActiveTrigger.set(null);
            }
            return isOpen;
          });
          if (!$rootOpen)
            e.preventDefault();
        }),
        addEventListener(node, "keydown", (e) => {
          const triggerElement = e.currentTarget;
          if (!isHTMLElement(triggerElement))
            return;
          if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN) {
            if (e.key === kbd.ARROW_DOWN) {
              e.preventDefault();
            }
            rootOpen.update((prev) => {
              const isOpen = !prev;
              if (isOpen) {
                nextFocusable.set(getNextFocusable(triggerElement));
                prevFocusable.set(getPreviousFocusable(triggerElement));
                rootActiveTrigger.set(triggerElement);
              } else {
                rootActiveTrigger.set(null);
              }
              return isOpen;
            });
            const menuId = triggerElement.getAttribute("aria-controls");
            if (!menuId)
              return;
            const menu = document.getElementById(menuId);
            if (!isHTMLElement(menu))
              return;
            const menuItems = getMenuItems(menu);
            if (!menuItems.length)
              return;
            const nextFocusedElement = menuItems[0];
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
  });
  const rootArrow = builder(name("arrow"), {
    stores: rootOptions,
    returned: ($rootOptions) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$rootOptions.arrowSize}px)`,
        height: `var(--arrow-size, ${$rootOptions.arrowSize}px)`
      })
    })
  });
  const item = builder(name("item"), {
    returned: () => ({
      role: "menuitem",
      tabindex: -1,
      "data-orientation": "vertical"
    }),
    action: (node, params = {}) => {
      const { onSelect } = params;
      setMeltMenuAttribute(node, selector);
      applyAttrsIfDisabled(node);
      const unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            e.preventDefault();
            return;
          }
        }),
        addEventListener(node, "click", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            e.preventDefault();
            return;
          }
          if (e.defaultPrevented) {
            if (!isHTMLElement(itemElement))
              return;
            handleRovingFocus(itemElement);
            return;
          }
          onSelect?.(e);
          if (e.defaultPrevented)
            return;
          rootOpen.set(false);
        }),
        addEventListener(node, "keydown", (e) => {
          onItemKeyDown(e);
        }),
        addEventListener(node, "pointermove", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            onItemLeave(e);
            return;
          }
          onMenuItemPointerMove(e);
        }),
        addEventListener(node, "pointerleave", (e) => {
          onMenuItemPointerLeave(e);
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
  });
  const checkboxItemDefaults = {
    checked: writable(false)
  };
  const checkboxItem = builder(name("checkbox-item"), {
    returned: () => ({
      role: "menuitemcheckbox",
      tabindex: -1,
      "data-orientation": "vertical"
    }),
    action: (node, params) => {
      setMeltMenuAttribute(node, selector);
      applyAttrsIfDisabled(node);
      const { checked, onSelect } = { ...checkboxItemDefaults, ...params };
      const $checked = get_store_value(checked);
      node.setAttribute("aria-checked", isIndeterminate($checked) ? "mixed" : String($checked));
      node.setAttribute("data-state", getCheckedState($checked));
      const unsub = executeCallbacks(
        addEventListener(node, "pointerdown", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            e.preventDefault();
            return;
          }
        }),
        addEventListener(node, "click", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            e.preventDefault();
            return;
          }
          if (e.defaultPrevented) {
            if (!isHTMLElement(itemElement))
              return;
            handleRovingFocus(itemElement);
            return;
          }
          onSelect?.(e);
          if (e.defaultPrevented)
            return;
          checked.update((prev) => {
            if (isIndeterminate(prev))
              return true;
            return !prev;
          });
          rootOpen.set(false);
        }),
        addEventListener(node, "keydown", (e) => {
          onItemKeyDown(e);
        }),
        addEventListener(node, "pointermove", (e) => {
          const itemElement = e.currentTarget;
          if (!isHTMLElement(itemElement))
            return;
          if (isElementDisabled(itemElement)) {
            onItemLeave(e);
            return;
          }
          onMenuItemPointerMove(e);
        }),
        addEventListener(node, "pointerleave", (e) => {
          onMenuItemPointerLeave(e);
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
  });
  const createMenuRadioGroup = (args = {}) => {
    const value = writable(args.value ?? null);
    const radioGroup = builder(name("radio-group"), {
      returned: () => ({
        role: "group"
      })
    });
    const radioItemDefaults = {
      disabled: false
    };
    const radioItem = builder(name("radio-item"), {
      stores: [value],
      returned: ([$value]) => {
        return (itemArgs) => {
          const { value: itemValue, disabled } = { ...radioItemDefaults, ...itemArgs };
          const checked = $value === itemValue;
          return {
            disabled,
            role: "menuitemradio",
            "data-state": checked ? "checked" : "unchecked",
            "aria-checked": checked,
            "data-disabled": disabled ? "" : void 0,
            "data-value": itemValue,
            "data-orientation": "vertical",
            tabindex: -1
          };
        };
      },
      action: (node, params = {}) => {
        setMeltMenuAttribute(node, selector);
        const { onSelect } = params;
        const unsub = executeCallbacks(
          addEventListener(node, "pointerdown", (e) => {
            const itemElement = e.currentTarget;
            if (!isHTMLElement(itemElement))
              return;
            const itemValue = node.dataset.value;
            const disabled = node.dataset.disabled;
            if (disabled || itemValue === void 0) {
              e.preventDefault();
              return;
            }
          }),
          addEventListener(node, "click", (e) => {
            const itemElement = e.currentTarget;
            if (!isHTMLElement(itemElement))
              return;
            const itemValue = node.dataset.value;
            const disabled = node.dataset.disabled;
            if (disabled || itemValue === void 0) {
              e.preventDefault();
              return;
            }
            if (e.defaultPrevented) {
              if (!isHTMLElement(itemElement))
                return;
              handleRovingFocus(itemElement);
              return;
            }
            onSelect?.(e);
            if (e.defaultPrevented)
              return;
            value.set(itemValue);
            rootOpen.set(false);
          }),
          addEventListener(node, "keydown", (e) => {
            onItemKeyDown(e);
          }),
          addEventListener(node, "pointermove", (e) => {
            const itemElement = e.currentTarget;
            if (!isHTMLElement(itemElement))
              return;
            const itemValue = node.dataset.value;
            const disabled = node.dataset.disabled;
            if (disabled || itemValue === void 0) {
              onItemLeave(e);
              return;
            }
            onMenuItemPointerMove(e);
          }),
          addEventListener(node, "pointerleave", (e) => {
            onMenuItemPointerLeave(e);
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
    });
    const isChecked = derived(value, ($value) => {
      return (itemValue) => {
        return $value === itemValue;
      };
    });
    return {
      radioGroup,
      radioItem,
      isChecked,
      value
    };
  };
  const { root: separator } = createSeparator({
    orientation: "horizontal"
  });
  const subMenuDefaults = {
    ...defaults,
    disabled: false,
    positioning: {
      placement: "right-start",
      gutter: 8
    }
  };
  const createSubMenu = (args) => {
    const withDefaults = { ...subMenuDefaults, ...args };
    const subOptions = writable(withDefaults);
    const subOpen = writable(false);
    const subActiveTrigger = writable(null);
    const subOpenTimer = writable(null);
    const pointerGraceTimer = writable(0);
    const subIds = {
      menu: generateId(),
      trigger: generateId()
    };
    const subMenu = builder(name("submenu"), {
      stores: [subOpen],
      returned: ([$subOpen]) => {
        return {
          role: "menu",
          hidden: $subOpen ? void 0 : true,
          style: styleToString({
            display: $subOpen ? void 0 : "none"
          }),
          id: subIds.menu,
          "aria-labelledby": subIds.trigger,
          "data-state": $subOpen ? "open" : "closed",
          tabindex: -1
        };
      },
      action: (node) => {
        let unsubPopper = noop;
        const unsubDerived = effect(
          [subOpen, subActiveTrigger, subOptions],
          ([$subOpen, $subActiveTrigger, $subOptions]) => {
            unsubPopper();
            if ($subOpen && $subActiveTrigger) {
              tick().then(() => {
                const parentMenuEl = getParentMenu($subActiveTrigger);
                const popper = usePopper(node, {
                  anchorElement: $subActiveTrigger,
                  open: subOpen,
                  options: {
                    floating: $subOptions.positioning,
                    portal: isHTMLElement(parentMenuEl) ? parentMenuEl : void 0,
                    clickOutside: null,
                    focusTrap: null
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
            if (e.key === kbd.ESCAPE) {
              return;
            }
            const target = e.target;
            if (!isHTMLElement(target))
              return;
            const menuElement = e.currentTarget;
            if (!isHTMLElement(menuElement))
              return;
            const isKeyDownInside = target.closest('[role="menu"]') === menuElement;
            if (!isKeyDownInside)
              return;
            if (FIRST_LAST_KEYS.includes(e.key)) {
              e.stopImmediatePropagation();
              handleMenuNavigation(e);
              return;
            }
            const isCloseKey = SUB_CLOSE_KEYS["ltr"].includes(e.key);
            const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
            const isCharacterKey = e.key.length === 1;
            if (isCloseKey) {
              const $subActiveTrigger = get_store_value(subActiveTrigger);
              e.preventDefault();
              subOpen.update(() => {
                if ($subActiveTrigger) {
                  handleRovingFocus($subActiveTrigger);
                }
                subActiveTrigger.set(null);
                return false;
              });
              return;
            }
            if (e.key === kbd.TAB) {
              e.preventDefault();
              return;
            }
            if (!isModifierKey && isCharacterKey) {
              handleTypeaheadSearch(e.key, getMenuItems(menuElement));
            }
          }),
          addEventListener(node, "pointermove", (e) => {
            onMenuPointerMove(e);
          }),
          addEventListener(node, "focusout", (e) => {
            const $subActiveTrigger = get_store_value(subActiveTrigger);
            if (get_store_value(isUsingKeyboard)) {
              const target = e.target;
              if (!isHTMLElement(target))
                return;
              const submenuElement = document.getElementById(subIds.menu);
              if (!isHTMLElement(submenuElement))
                return;
              if (!submenuElement?.contains(target) && target !== $subActiveTrigger) {
                subOpen.set(false);
                subActiveTrigger.set(null);
              }
            } else {
              const menuElement = e.currentTarget;
              if (!isHTMLElement(menuElement))
                return;
              const relatedTarget = e.relatedTarget;
              if (!isHTMLElement(relatedTarget))
                return;
              if (!menuElement.contains(relatedTarget) && relatedTarget !== $subActiveTrigger) {
                subOpen.set(false);
                subActiveTrigger.set(null);
              }
            }
          })
        );
        return {
          destroy() {
            unsubDerived();
            unsubPopper();
            unsubEvents();
          }
        };
      }
    });
    const subTrigger = builder(name("subtrigger"), {
      stores: [subOpen, subOptions],
      returned: ([$subOpen, $subOptions]) => {
        return {
          role: "menuitem",
          id: subIds.trigger,
          tabindex: -1,
          "aria-controls": subIds.menu,
          "aria-expanded": $subOpen,
          "data-state": $subOpen ? "open" : "closed",
          "data-disabled": $subOptions.disabled ? "" : void 0,
          "aria-haspopop": "menu"
        };
      },
      action: (node) => {
        setMeltMenuAttribute(node, selector);
        applyAttrsIfDisabled(node);
        const unsubTimer = () => {
          clearTimerStore(subOpenTimer);
          window.clearTimeout(get_store_value(pointerGraceTimer));
          pointerGraceIntent.set(null);
        };
        const unsubEvents = executeCallbacks(
          addEventListener(node, "click", (e) => {
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            if (isElementDisabled(triggerElement) || e.defaultPrevented)
              return;
            handleRovingFocus(triggerElement);
            if (!get_store_value(subOpen)) {
              subOpen.update((prev) => {
                const isAlreadyOpen = prev;
                if (!isAlreadyOpen) {
                  subActiveTrigger.set(triggerElement);
                  return !prev;
                }
                return prev;
              });
            }
          }),
          addEventListener(node, "keydown", (e) => {
            const $typed = get_store_value(typed);
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            if (isElementDisabled(triggerElement))
              return;
            const isTypingAhead = $typed.length > 0;
            if (isTypingAhead && e.key === kbd.SPACE)
              return;
            if (SUB_OPEN_KEYS["ltr"].includes(e.key)) {
              if (!get_store_value(subOpen)) {
                triggerElement.click();
                e.preventDefault();
                return;
              }
              const menuId = triggerElement.getAttribute("aria-controls");
              if (!menuId)
                return;
              const menuElement = document.getElementById(menuId);
              if (!isHTMLElement(menuElement))
                return;
              const firstItem = getMenuItems(menuElement)[0];
              if (!isHTMLElement(firstItem))
                return;
              handleRovingFocus(firstItem);
            }
          }),
          addEventListener(node, "pointermove", (e) => {
            if (!isMouse(e))
              return;
            onItemEnter(e);
            if (e.defaultPrevented)
              return;
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            handleRovingFocus(triggerElement);
            const openTimer = get_store_value(subOpenTimer);
            if (!get_store_value(subOpen) && !openTimer && !isElementDisabled(triggerElement)) {
              subOpenTimer.set(
                window.setTimeout(() => {
                  subOpen.update(() => {
                    subActiveTrigger.set(triggerElement);
                    return true;
                  });
                  clearTimerStore(subOpenTimer);
                }, 100)
              );
            }
          }),
          addEventListener(node, "pointerleave", (e) => {
            if (!isMouse(e))
              return;
            clearTimerStore(subOpenTimer);
            const submenuElement = document.getElementById(subIds.menu);
            const contentRect = submenuElement?.getBoundingClientRect();
            if (contentRect) {
              const side = submenuElement?.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              pointerGraceIntent.set({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: e.clientX + bleed, y: e.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(get_store_value(pointerGraceTimer));
              pointerGraceTimer.set(
                window.setTimeout(() => {
                  pointerGraceIntent.set(null);
                }, 300)
              );
            } else {
              onTriggerLeave(e);
              if (e.defaultPrevented)
                return;
              pointerGraceIntent.set(null);
            }
          }),
          addEventListener(node, "focusout", (e) => {
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            if (!isHTMLElement(triggerElement))
              return;
            triggerElement.removeAttribute("data-highlighted");
            const relatedTarget = e.relatedTarget;
            if (!isHTMLElement(relatedTarget))
              return;
            const menuId = triggerElement.getAttribute("aria-controls");
            if (!menuId)
              return;
            const menu = document.getElementById(menuId);
            if (isHTMLElement(menu) && !menu.contains(relatedTarget)) {
              subActiveTrigger.set(null);
              subOpen.set(false);
            }
          }),
          addEventListener(node, "focusin", (e) => {
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            triggerElement.setAttribute("data-highlighted", "");
          })
        );
        return {
          destroy() {
            unsubTimer();
            unsubEvents();
          }
        };
      }
    });
    const subArrow = builder(name("subarrow"), {
      stores: subOptions,
      returned: ($subOptions) => ({
        "data-arrow": true,
        style: styleToString({
          position: "absolute",
          width: `var(--arrow-size, ${$subOptions.arrowSize}px)`,
          height: `var(--arrow-size, ${$subOptions.arrowSize}px)`
        })
      })
    });
    effect([rootOpen], ([$rootOpen]) => {
      if (!$rootOpen) {
        subActiveTrigger.set(null);
        subOpen.set(false);
      }
    });
    effect([pointerGraceIntent], ([$pointerGraceIntent]) => {
      if (!isBrowser)
        return;
      if (!$pointerGraceIntent) {
        window.clearTimeout(get_store_value(pointerGraceTimer));
      }
    });
    effect([subOpen], ([$subOpen]) => {
      if (!isBrowser)
        return;
      sleep(1).then(() => {
        const menuElement = document.getElementById(subIds.menu);
        if (isHTMLElement(menuElement) && $subOpen && get_store_value(isUsingKeyboard)) {
          const menuItems = getMenuItems(menuElement);
          if (get_store_value(isUsingKeyboard)) {
            isHTMLElement(menuItems[0]) ? handleRovingFocus(menuItems[0]) : void 0;
          }
        }
      });
    });
    return {
      subTrigger,
      subMenu,
      subOpen,
      subArrow,
      subOptions
    };
  };
  effect([rootOpen, rootActiveTrigger], ([$rootOpen, $rootActiveTrigger]) => {
    if (!isBrowser)
      return;
    const unsubs = [];
    const $rootOptions = get_store_value(rootOptions);
    if ($rootOpen && $rootOptions.preventScroll) {
      unsubs.push(removeScroll());
    }
    if (!$rootOpen && $rootActiveTrigger) {
      handleRovingFocus($rootActiveTrigger);
    }
    sleep(1).then(() => {
      const menuElement = document.getElementById(rootIds.menu);
      if (isHTMLElement(menuElement) && $rootOpen && get_store_value(isUsingKeyboard)) {
        if (opts.disableFocusFirstItem) {
          handleRovingFocus(menuElement);
          return;
        }
        const menuItems = getMenuItems(menuElement);
        isHTMLElement(menuItems[0]) ? handleRovingFocus(menuItems[0]) : void 0;
      } else if ($rootActiveTrigger) {
        handleRovingFocus($rootActiveTrigger);
      } else {
        if (opts.disableTriggerRefocus) {
          return;
        }
        const triggerElement = document.getElementById(rootIds.trigger);
        if (isHTMLElement(triggerElement)) {
          handleRovingFocus(triggerElement);
        }
      }
    });
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  function onItemEnter(e) {
    if (isPointerMovingToSubmenu(e)) {
      e.preventDefault();
    }
  }
  function onItemLeave(e) {
    if (isPointerMovingToSubmenu(e)) {
      return;
    }
    const target = e.target;
    if (!isHTMLElement(target))
      return;
    const parentMenuElement = getParentMenu(target);
    if (!isHTMLElement(parentMenuElement))
      return;
    handleRovingFocus(parentMenuElement);
  }
  function onTriggerLeave(e) {
    if (isPointerMovingToSubmenu(e)) {
      e.preventDefault();
    }
  }
  function onMenuPointerMove(e) {
    if (!isMouse(e))
      return;
    const target = e.target;
    if (!isHTMLElement(target))
      return;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget))
      return;
    const $lastPointerX = get_store_value(lastPointerX);
    const pointerXHasChanged = $lastPointerX !== e.clientX;
    if (currentTarget.contains(target) && pointerXHasChanged) {
      const newDir = e.clientX > $lastPointerX ? "right" : "left";
      pointerDir.set(newDir);
      lastPointerX.set(e.clientX);
    }
  }
  function onMenuItemPointerMove(e) {
    if (!isMouse(e))
      return;
    onItemEnter(e);
    if (!e.defaultPrevented) {
      const currentTarget = e.currentTarget;
      if (!isHTMLElement(currentTarget))
        return;
      handleRovingFocus(currentTarget);
    }
  }
  function onMenuItemPointerLeave(e) {
    if (!isMouse(e))
      return;
    onItemLeave(e);
  }
  function onItemKeyDown(e) {
    const $typed = get_store_value(typed);
    const isTypingAhead = $typed.length > 0;
    if (isTypingAhead && e.key === kbd.SPACE) {
      e.preventDefault();
      return;
    }
    if (SELECTION_KEYS.includes(e.key)) {
      e.preventDefault();
      const itemElement = e.currentTarget;
      if (!isHTMLElement(itemElement))
        return;
      itemElement.click();
    }
  }
  function isIndeterminate(checked) {
    return checked === "indeterminate";
  }
  function getCheckedState(checked) {
    return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
  }
  function isPointerMovingToSubmenu(e) {
    return get_store_value(pointerMovingToSubmenu)(e);
  }
  function getParentMenu(element) {
    return element.closest('[role="menu"]');
  }
  return {
    trigger: rootTrigger,
    menu: rootMenu,
    open: rootOpen,
    item,
    checkboxItem,
    arrow: rootArrow,
    options: rootOptions,
    createSubMenu,
    createMenuRadioGroup,
    separator,
    rootIds,
    handleTypeaheadSearch
  };
}
function handleTabNavigation(e, nextFocusable, prevFocusable) {
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
function getMenuItems(menuElement) {
  return Array.from(
    menuElement.querySelectorAll(`[data-melt-menu-id="${menuElement.id}"]`)
  );
}
function applyAttrsIfDisabled(element) {
  if (!isBrowser)
    return;
  if (!isHTMLElement(element))
    return;
  if (isElementDisabled(element)) {
    element.setAttribute("data-disabled", "");
    element.setAttribute("aria-disabled", "true");
  }
}
function clearTimerStore(timerStore) {
  if (!isBrowser)
    return;
  const timer = get_store_value(timerStore);
  if (timer) {
    window.clearTimeout(timer);
    timerStore.set(null);
  }
}
function isMouse(e) {
  return e.pointerType === "mouse";
}
function setMeltMenuAttribute(element, selector) {
  if (!element)
    return;
  const menuEl = element.closest(`${selector()}, ${selector("submenu")}`);
  if (!isHTMLElement(menuEl))
    return;
  element.setAttribute("data-melt-menu-id", menuEl.id);
}
function handleMenuNavigation(e) {
  e.preventDefault();
  const currentFocusedItem = document.activeElement;
  if (!isHTMLElement(currentFocusedItem))
    return;
  const currentTarget = e.currentTarget;
  if (!isHTMLElement(currentTarget))
    return;
  const menuItems = getMenuItems(currentTarget);
  if (!menuItems.length)
    return;
  const candidateNodes = menuItems.filter((item) => {
    if (item.hasAttribute("data-disabled")) {
      return false;
    }
    if (item.getAttribute("disabled") === "true") {
      return false;
    }
    return true;
  });
  const currentIndex = candidateNodes.indexOf(currentFocusedItem);
  let nextIndex;
  switch (e.key) {
    case kbd.ARROW_DOWN:
      nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : currentIndex;
      break;
    case kbd.ARROW_UP:
      nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
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
  const nextFocusedItem = candidateNodes[nextIndex];
  handleRovingFocus(nextFocusedItem);
}
function isPointerInGraceArea(e, area) {
  if (!area)
    return false;
  const cursorPos = { x: e.clientX, y: e.clientY };
  return isPointInPolygon(cursorPos, area);
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect)
      inside = !inside;
  }
  return inside;
}
export {
  FIRST_LAST_KEYS as F,
  SELECTION_KEYS as S,
  handleTabNavigation as a,
  applyAttrsIfDisabled as b,
  createMenuBuilder as c,
  clearTimerStore as d,
  getMenuItems as g,
  handleMenuNavigation as h,
  setMeltMenuAttribute as s
};
