import { n as next, p as prev, l as last } from "./array.js";
import { b as builder } from "./builder.js";
import { a as isBrowser } from "./is.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { g as getDirectionalKeys, k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { w as writable } from "./index2.js";
import { g as getElemDirection } from "./locale.js";
import { g as get_store_value } from "./utils.js";
const defaults = {
  orientation: "horizontal",
  activateOnFocus: true,
  loop: true,
  autoSet: true
};
function createTabs(args) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "value"));
  const value = writable(withDefaults.value);
  let ssrValue = withDefaults.value;
  value.subscribe((value2) => {
    withDefaults.onChange?.(value2);
  });
  const root = builder("tabs-root", {
    stores: options,
    returned: ($options) => {
      return {
        "data-orientation": $options.orientation
      };
    }
  });
  const list = builder("list", {
    stores: options,
    returned: ($options) => {
      return {
        role: "tablist",
        "aria-orientation": $options.orientation,
        "data-orientation": $options.orientation
      };
    }
  });
  const parseTriggerArgs = (args2) => {
    if (typeof args2 === "string") {
      return { value: args2 };
    } else {
      return args2;
    }
  };
  const trigger = builder("trigger", {
    stores: [value, options],
    returned: ([$value, $options]) => {
      return (args2) => {
        const { value: tabValue, disabled } = parseTriggerArgs(args2);
        if (!$value && !ssrValue && $options.autoSet) {
          ssrValue = tabValue;
          value.set(tabValue);
        }
        return {
          role: "tab",
          "data-state": isBrowser ? $value === tabValue ? "active" : "inactive" : ssrValue === tabValue ? "active" : "inactive",
          tabindex: $value === tabValue ? 0 : -1,
          "data-value": tabValue,
          "data-orientation": $options.orientation,
          "data-disabled": disabled ? true : void 0,
          disabled
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "focus", () => {
          const $options = get_store_value(options);
          const disabled = node.dataset.disabled === "true";
          const tabValue = node.dataset.value;
          if ($options.activateOnFocus && !disabled && tabValue !== void 0) {
            value.set(tabValue);
          }
        }),
        addEventListener(node, "click", (e) => {
          const disabled = node.dataset.disabled === "true";
          if (disabled)
            return;
          const el = e.currentTarget;
          if (el && "focus" in el) {
            el.focus();
          }
        }),
        addEventListener(node, "keydown", (e) => {
          const tabValue = node.dataset.value;
          const el = e.currentTarget;
          const rootEl = el.closest("[data-melt-tabs-root]");
          if (!rootEl || !tabValue)
            return;
          const $options = get_store_value(options);
          const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]'));
          const enabledTriggers = triggers.filter((el2) => !el2.hasAttribute("data-disabled"));
          const triggerIdx = Array.from(enabledTriggers ?? []).findIndex((el2) => el2 === e.target);
          const dir = getElemDirection(rootEl);
          const { nextKey, prevKey } = getDirectionalKeys(dir, $options.orientation);
          if (e.key === nextKey) {
            e.preventDefault();
            next(enabledTriggers, triggerIdx, $options.loop)?.focus();
          } else if (e.key === prevKey) {
            e.preventDefault();
            prev(enabledTriggers, triggerIdx, $options.loop)?.focus();
          } else if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
            e.preventDefault();
            value.set(tabValue);
          } else if (e.key === kbd.HOME) {
            e.preventDefault();
            enabledTriggers[0]?.focus();
          } else if (e.key === kbd.END) {
            e.preventDefault();
            last(enabledTriggers)?.focus();
          }
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const content = builder("content", {
    stores: value,
    returned: ($value) => {
      return (tabValue) => {
        return {
          role: "tabpanel",
          // TODO: improve
          "aria-labelledby": tabValue,
          hidden: isBrowser ? $value === tabValue ? void 0 : true : ssrValue === tabValue ? void 0 : true,
          tabindex: 0
        };
      };
    }
  });
  return {
    value,
    root,
    list,
    trigger,
    content,
    options
  };
}
export {
  createTabs as c
};
