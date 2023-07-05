import { b as builder } from "./builder.js";
import { a as addEventListener } from "./event.js";
import { s as styleToString } from "./style.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { d as derived, w as writable } from "./index2.js";
import { g as get_store_value } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  checked: false,
  disabled: false,
  required: false
};
function createCheckbox(args = {}) {
  const argsWithDefaults = { ...defaults, ...args };
  const options = writable({
    disabled: argsWithDefaults.disabled,
    required: argsWithDefaults.required,
    name: argsWithDefaults.name,
    value: argsWithDefaults.value
  });
  const checked = writable(argsWithDefaults.checked);
  const root = builder("checkbox", {
    stores: [checked, options],
    returned: ([$checked, $options]) => {
      return {
        "data-disabled": $options.disabled,
        "data-state": $checked === "indeterminate" ? "indeterminate" : $checked ? "checked" : "unchecked",
        type: "button",
        role: "checkbox",
        "aria-checked": $checked === "indeterminate" ? "mixed" : $checked,
        "aria-required": $options.required
      };
    },
    action(node) {
      const unsub = executeCallbacks(
        addEventListener(node, "keydown", (event) => {
          if (event.key === kbd.ENTER)
            event.preventDefault();
        })
      );
      addEventListener(node, "click", () => {
        const $options = get_store_value(options);
        if ($options.disabled)
          return;
        checked.update((value) => {
          if (value === "indeterminate")
            return true;
          return !value;
        });
      });
      return {
        destroy: unsub
      };
    }
  });
  const input = builder("checkbox-input", {
    stores: [checked, options],
    returned: ([$checked, $options]) => {
      return {
        type: "checkbox",
        "aria-hidden": true,
        hidden: true,
        tabindex: -1,
        name: $options.name,
        value: $options.value,
        checked: $checked === "indeterminate" ? false : $checked,
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
    }
  });
  const isIndeterminate = derived(checked, ($checked) => $checked === "indeterminate");
  const isChecked = derived(checked, ($checked) => $checked === true);
  return {
    root,
    input,
    checked,
    isIndeterminate,
    isChecked,
    options
  };
}
const Minus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Minus as M,
  createCheckbox as c
};
