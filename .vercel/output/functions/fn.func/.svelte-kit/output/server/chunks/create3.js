import { g as get_store_value } from "./utils.js";
import { d as derived, w as writable } from "./index2.js";
import { a as addEventListener } from "./event.js";
import { s as styleToString } from "./style.js";
const defaults = {
  checked: false,
  disabled: false,
  required: false,
  name: "",
  value: ""
};
function createSwitch(args = {}) {
  const argsWithDefaults = { ...defaults, ...args };
  const options = writable({
    disabled: argsWithDefaults.disabled,
    required: argsWithDefaults.required,
    name: argsWithDefaults.name,
    value: argsWithDefaults.value
  });
  const checked = writable(argsWithDefaults.checked);
  const root = {
    ...derived([checked, options], ([$checked, $options]) => {
      return {
        "data-disabled": $options.disabled,
        disabled: $options.disabled,
        "data-state": $checked ? "checked" : "unchecked",
        type: "button",
        role: "switch",
        "aria-checked": $checked,
        "aria-required": $options.required
      };
    }),
    action(node) {
      const unsub = addEventListener(node, "click", () => {
        const $options = get_store_value(options);
        if ($options.disabled)
          return;
        checked.update((value) => !value);
      });
      return {
        destroy: unsub
      };
    }
  };
  const input = derived([checked, options], ([$checked, $options]) => {
    return {
      type: "checkbox",
      "aria-hidden": true,
      hidden: true,
      tabindex: -1,
      name: $options.name,
      value: $options.value,
      checked: $checked,
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
  const isChecked = derived(checked, ($checked) => $checked === true);
  return {
    root,
    input,
    checked,
    isChecked,
    options
  };
}
export {
  createSwitch as c
};
