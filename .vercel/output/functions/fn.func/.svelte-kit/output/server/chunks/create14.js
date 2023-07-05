import { g as get_store_value } from "./utils.js";
import { w as writable, d as derived } from "./index2.js";
import { a as addEventListener } from "./event.js";
function createToggle(args = {}) {
  const pressed = writable(args.pressed ?? false);
  const disabled = writable(args.disabled ?? false);
  const toggle = {
    ...derived([pressed, disabled], ([$pressed, $disabled]) => {
      return {
        "data-disabled": $disabled ? true : void 0,
        disabled: $disabled,
        "data-state": $pressed ? "on" : "off",
        "aria-pressed": $pressed,
        type: "button"
      };
    }),
    action: (node) => {
      const unsub = addEventListener(node, "click", () => {
        const $disabled = get_store_value(disabled);
        if ($disabled)
          return;
        pressed.update((v) => !v);
      });
      return {
        destroy: unsub
      };
    }
  };
  return {
    toggle,
    pressed,
    disabled
  };
}
export {
  createToggle as c
};
