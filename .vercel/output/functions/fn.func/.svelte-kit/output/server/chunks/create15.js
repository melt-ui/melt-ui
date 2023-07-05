import { g as get_store_value } from "./utils.js";
import { w as writable, d as derived } from "./index2.js";
import { b as isHTMLElement } from "./is.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks, n as noop } from "./callbacks.js";
import { h as handleRovingFocus } from "./rovingFocus.js";
import { g as getElemDirection } from "./locale.js";
const defaults = {
  type: "single",
  orientation: "horizontal",
  loop: true,
  rovingFocus: true,
  disabled: false,
  value: null
};
function createToggleGroup(args = {}) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "value"));
  const value = writable(withDefaults.value);
  options.subscribe((o) => {
    value.update((v) => {
      if (o.type === "single" && Array.isArray(v)) {
        return null;
      }
      if (o.type === "multiple" && !Array.isArray(v)) {
        return v === null ? [] : [v];
      }
      return v;
    });
  });
  const root = derived(options, ($options) => {
    return {
      role: "group",
      "data-orientation": $options.orientation,
      "data-melt-toggle-group": ""
    };
  });
  const item = {
    ...derived([options, value], ([$options, $value]) => {
      return (args2) => {
        const itemValue = typeof args2 === "string" ? args2 : args2.value;
        const argDisabled = typeof args2 === "string" ? false : !!args2.disabled;
        const disabled = $options.disabled || argDisabled;
        const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
        return {
          disabled,
          pressed,
          "data-orientation": $options.orientation,
          "data-disabled": disabled ? true : void 0,
          "data-state": pressed ? "on" : "off",
          "data-value": itemValue,
          "aria-pressed": pressed,
          type: "button",
          "data-melt-toggle-group-item": "",
          role: $options.type === "single" ? "radio" : void 0,
          tabindex: pressed ? 0 : -1
        };
      };
    }),
    action: (node) => {
      let unsub = noop;
      const getNodeProps = () => {
        const itemValue = node.dataset.value;
        const disabled = node.dataset.disabled === "true";
        return { value: itemValue, disabled };
      };
      const parentGroup = node.closest("[data-melt-toggle-group]");
      if (!isHTMLElement(parentGroup))
        return;
      const items = Array.from(
        parentGroup.querySelectorAll("[data-melt-toggle-group-item]")
      );
      const $value = get_store_value(value);
      const anyPressed = Array.isArray($value) ? $value.length > 0 : $value !== null;
      if (!anyPressed && items[0] === node) {
        node.tabIndex = 0;
      }
      unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          const { value: itemValue, disabled } = getNodeProps();
          if (itemValue === void 0 || disabled)
            return;
          value.update((v) => {
            if (Array.isArray(v)) {
              return v.includes(itemValue) ? v.filter((i) => i !== itemValue) : [...v, itemValue];
            }
            return v === itemValue ? null : itemValue;
          });
        }),
        addEventListener(node, "keydown", (e) => {
          const $options = get_store_value(options);
          if (!$options.rovingFocus)
            return;
          const el = e.currentTarget;
          if (!isHTMLElement(el))
            return;
          const root2 = el.closest("[data-melt-toggle-group]");
          if (!isHTMLElement(root2))
            return;
          const items2 = Array.from(
            root2.querySelectorAll("[data-melt-toggle-group-item]:not([data-disabled])")
          );
          const currentIndex = items2.indexOf(el);
          const dir = getElemDirection(el);
          const nextKey = {
            horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
            vertical: kbd.ARROW_DOWN
          }[$options.orientation ?? "horizontal"];
          const prevKey = {
            horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
            vertical: kbd.ARROW_UP
          }[$options.orientation ?? "horizontal"];
          if (e.key === nextKey) {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex >= items2.length) {
              if ($options.loop) {
                handleRovingFocus(items2[0]);
              }
            } else {
              handleRovingFocus(items2[nextIndex]);
            }
          } else if (e.key === prevKey) {
            e.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
              if ($options.loop) {
                handleRovingFocus(items2[items2.length - 1]);
              }
            } else {
              handleRovingFocus(items2[prevIndex]);
            }
          } else if (e.key === kbd.HOME) {
            e.preventDefault();
            handleRovingFocus(items2[0]);
          } else if (e.key === kbd.END) {
            e.preventDefault();
            handleRovingFocus(items2[items2.length - 1]);
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  };
  const isPressed = derived(value, ($value) => {
    return (itemValue) => {
      return Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
    };
  });
  return {
    options,
    value,
    root,
    item,
    isPressed
  };
}
export {
  createToggleGroup as c
};
