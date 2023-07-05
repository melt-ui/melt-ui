import { b as builder, c as createElHelpers, g as getElementByMeltId } from "./builder.js";
import { a as addEventListener } from "./event.js";
import { g as generateId } from "./id.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { d as derived, w as writable } from "./index2.js";
import { g as get_store_value } from "./utils.js";
const { name } = createElHelpers("accordion");
const defaults = {
  type: "single"
};
const createAccordion = (args) => {
  const withDefaults = { ...defaults, ...args };
  const options = writable({
    disabled: withDefaults.disabled,
    type: withDefaults.type
  });
  const value = writable(withDefaults.value);
  const isSelected = (key, v) => {
    if (v === void 0)
      return false;
    if (typeof v === "string")
      return v === key;
    return v.includes(key);
  };
  const isSelectedStore = derived(value, ($value) => {
    return (key) => isSelected(key, $value);
  });
  const ids = {
    root: generateId()
  };
  const root = builder(name(), {
    returned: () => ({
      "data-melt-id": ids.root
    })
  });
  const parseItemArgs = (args2) => {
    if (typeof args2 === "string") {
      return { value: args2 };
    } else {
      return args2;
    }
  };
  const item = builder(name("item"), {
    stores: value,
    returned: ($value) => {
      return (args2) => {
        const { value: itemValue, disabled } = parseItemArgs(args2);
        return {
          "data-state": isSelected(itemValue, $value) ? "open" : "closed",
          "data-disabled": disabled ? true : void 0
        };
      };
    }
  });
  const trigger = builder(name("trigger"), {
    stores: [value, options],
    returned: ([$value, $options]) => {
      return (args2) => {
        const { value: itemValue, disabled } = parseItemArgs(args2);
        return {
          "aria-expanded": isSelected(itemValue, $value) ? true : false,
          disabled: $options.disabled || disabled,
          "data-disabled": disabled ? true : void 0,
          "data-value": itemValue
          // TODO: aria-controls, aria-labelledby
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          const $options = get_store_value(options);
          const disabled = node.dataset.disabled === "true";
          const itemValue = node.dataset.value;
          if (disabled || !itemValue)
            return;
          value.update(($value) => {
            if ($options.type === "single") {
              return $value === itemValue ? void 0 : itemValue;
            } else {
              const arrValue = $value;
              if (arrValue === void 0) {
                return [itemValue];
              } else {
                return arrValue.includes(itemValue) ? arrValue.filter((v) => v !== itemValue) : [...arrValue, itemValue];
              }
            }
          });
        }),
        addEventListener(node, "keydown", (e) => {
          if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
            return;
          }
          e.preventDefault();
          const el = e.target;
          const rootEl = getElementByMeltId(ids.root);
          if (!rootEl)
            return;
          const items = Array.from(
            rootEl.querySelectorAll("[data-melt-accordion-trigger]")
          );
          if (!items.length)
            return;
          const elIdx = items.indexOf(el);
          if (e.key === kbd.ARROW_DOWN) {
            items[(elIdx + 1) % items.length].focus();
          }
          if (e.key === kbd.ARROW_UP) {
            items[(elIdx - 1 + items.length) % items.length].focus();
          }
          if (e.key === kbd.HOME) {
            items[0].focus();
          }
          if (e.key === kbd.END) {
            items[items.length - 1].focus();
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const content = builder(name("content"), {
    stores: [value, options],
    returned: ([$value, $options]) => {
      return (args2) => {
        const { value: itemValue } = parseItemArgs(args2);
        const selected = isSelected(itemValue, $value);
        return {
          "data-state": selected ? "open" : "closed",
          "data-disabled": $options.disabled ? true : void 0,
          hidden: selected ? void 0 : true
        };
      };
    }
  });
  return {
    root,
    value,
    item,
    trigger,
    content,
    isSelected: isSelectedStore,
    options
  };
};
export {
  createAccordion as c
};
