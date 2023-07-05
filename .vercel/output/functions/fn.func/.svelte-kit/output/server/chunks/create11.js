import { g as get_store_value } from "./utils.js";
import { d as derived, w as writable } from "./index2.js";
import { a as addEventListener } from "./event.js";
import { g as getDirectionalKeys, k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { g as getElemDirection } from "./locale.js";
const defaults = {
  orientation: "vertical",
  loop: true,
  disabled: false,
  required: false
};
function createRadioGroup(args = {}) {
  const withDefaults = { ...defaults, ...args };
  const options = writable({
    disabled: withDefaults.disabled,
    required: withDefaults.required,
    loop: withDefaults.loop,
    orientation: withDefaults.orientation
  });
  const value = writable(withDefaults.value ?? null);
  const root = derived(options, ($options) => {
    return {
      role: "radiogroup",
      "aria-required": $options.required,
      "data-orientation": $options.orientation,
      "data-melt-part": "radio-group"
    };
  });
  const item = {
    ...derived([options, value], ([$options, $value]) => {
      return (args2) => {
        const itemValue = typeof args2 === "string" ? args2 : args2.value;
        const argDisabled = typeof args2 === "string" ? false : !!args2.disabled;
        const disabled = $options.disabled || argDisabled;
        const checked = $value === itemValue;
        return {
          disabled,
          "data-value": itemValue,
          "data-orientation": $options.orientation,
          "data-disabled": disabled ? true : void 0,
          "data-state": checked ? "checked" : "unchecked",
          "aria-checked": checked,
          type: "button",
          role: "radio",
          "data-melt-part": "radio-group-item",
          tabindex: $value === null ? 0 : checked ? 0 : -1
        };
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          const disabled = node.dataset.disabled === "true";
          const itemValue = node.dataset.value;
          if (disabled || itemValue === void 0)
            return;
          value.set(itemValue);
        }),
        addEventListener(node, "focus", (e) => {
          const el = e.currentTarget;
          el.click();
        }),
        addEventListener(node, "keydown", (e) => {
          const $options = get_store_value(options);
          const el = e.currentTarget;
          const root2 = el.closest('[data-melt-part="radio-group"]');
          const items = Array.from(
            root2.querySelectorAll('[data-melt-part="radio-group-item"]')
          );
          const currentIndex = items.indexOf(el);
          const dir = getElemDirection(root2);
          const { nextKey, prevKey } = getDirectionalKeys(dir, $options.orientation);
          if (e.key === nextKey) {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) {
              if ($options.loop) {
                items[0].focus();
              }
            } else {
              items[nextIndex].focus();
            }
          } else if (e.key === prevKey) {
            e.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
              if ($options.loop) {
                items[items.length - 1].focus();
              }
            } else {
              items[prevIndex].focus();
            }
          } else if (e.key === kbd.HOME) {
            e.preventDefault();
            items[0].focus();
          } else if (e.key === kbd.END) {
            e.preventDefault();
            items[items.length - 1].focus();
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  };
  const itemInput = derived([options, value], ([$options, $value]) => {
    return (args2) => {
      const itemValue = typeof args2 === "string" ? args2 : args2.value;
      const argDisabled = typeof args2 === "string" ? false : !!args2.disabled;
      const disabled = $options.disabled || argDisabled;
      return {
        type: "hidden",
        "aria-hidden": true,
        tabindex: -1,
        value: itemValue,
        checked: $value === itemValue,
        disabled
      };
    };
  });
  const isChecked = derived(value, ($value) => {
    return (itemValue) => {
      return $value === itemValue;
    };
  });
  return {
    options,
    value,
    root,
    item,
    itemInput,
    isChecked
  };
}
export {
  createRadioGroup as c
};
