import { h as hiddenAction } from "./builder.js";
import { b as isHTMLElement } from "./is.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { h as handleRovingFocus } from "./rovingFocus.js";
import { d as derived, w as writable } from "./index2.js";
import { g as get_store_value } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
const defaults = {
  loop: true,
  orientation: "horizontal"
};
function createToolbar(args = {}) {
  const withDefaults = { ...defaults, ...args };
  const toolbarOptions = writable({ ...withDefaults });
  const root = derived(toolbarOptions, ($toolbarOptions) => {
    return {
      role: "toolbar",
      "data-orientation": $toolbarOptions.orientation,
      "data-melt-toolbar": ""
    };
  });
  const button = hiddenAction({
    role: "button",
    type: "button",
    "data-melt-toolbar-item": "",
    action: (node) => {
      const unsub = addEventListener(node, "keydown", getKeydownHandler(toolbarOptions));
      return {
        destroy: unsub
      };
    },
    tabIndex: -1
  });
  const link = hiddenAction({
    role: "link",
    "data-melt-toolbar-item": "",
    action: (node) => {
      const unsub = addEventListener(node, "keydown", getKeydownHandler(toolbarOptions));
      return {
        destroy: unsub
      };
    },
    tabIndex: -1
  });
  const separator = derived(toolbarOptions, ($toolbarOptions) => {
    return {
      role: "separator",
      "data-orientation": $toolbarOptions.orientation === "horizontal" ? "vertical" : "horizontal",
      "aria-orientation": $toolbarOptions.orientation === "horizontal" ? "vertical" : "horizontal",
      "data-melt-toolbar-separator": ""
    };
  });
  const groupDefaults = {
    type: "single",
    disabled: false,
    value: null
  };
  function createToolbarGroup(args2 = {}) {
    const groupWithDefaults = { ...groupDefaults, ...args2 };
    const groupOptions = writable(omit(groupWithDefaults, "value"));
    const value = writable(groupWithDefaults.value);
    groupOptions.subscribe((o) => {
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
    const root2 = derived(toolbarOptions, ($toolbarOptions) => {
      return {
        role: "group",
        "data-orientation": $toolbarOptions.orientation,
        "data-melt-toolbar-group": ""
      };
    });
    const item = {
      ...derived(
        [groupOptions, value, toolbarOptions],
        ([$groupOptions, $value, $toolbarOptions]) => {
          return (args3) => {
            const itemValue = typeof args3 === "string" ? args3 : args3.value;
            const argDisabled = typeof args3 === "string" ? false : !!args3.disabled;
            const disabled = $groupOptions.disabled || argDisabled;
            const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
            return {
              disabled,
              pressed,
              "data-orientation": $toolbarOptions.orientation,
              "data-disabled": disabled ? true : void 0,
              "data-value": itemValue,
              "data-state": pressed ? "on" : "off",
              "aria-pressed": pressed,
              type: "button",
              role: $groupOptions.type === "single" ? "radio" : void 0,
              "data-melt-toolbar-item": ""
            };
          };
        }
      ),
      action: (node) => {
        const getNodeProps = () => {
          const itemValue = node.dataset.value;
          const disabled = node.dataset.disabled === "true";
          return { value: itemValue, disabled };
        };
        const parentToolbar = node.closest("[data-melt-toolbar]");
        if (!parentToolbar)
          return;
        const items = getToolbarItems(parentToolbar);
        if (items[0] === node) {
          node.tabIndex = 0;
        } else {
          node.tabIndex = -1;
        }
        const unsub = executeCallbacks(
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
          addEventListener(node, "keydown", getKeydownHandler(toolbarOptions))
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
      options: groupOptions,
      value,
      root: root2,
      item,
      isPressed
    };
  }
  return {
    root,
    options: toolbarOptions,
    button,
    link,
    separator,
    createToolbarGroup
  };
}
function getToolbarItems(element) {
  return Array.from(element.querySelectorAll("[data-melt-toolbar-item]"));
}
const getKeydownHandler = (options) => (e) => {
  const $options = get_store_value(options);
  const nextKey = {
    horizontal: kbd.ARROW_RIGHT,
    vertical: kbd.ARROW_DOWN
  }[$options.orientation ?? "horizontal"];
  const prevKey = {
    horizontal: kbd.ARROW_LEFT,
    vertical: kbd.ARROW_UP
  }[$options.orientation ?? "horizontal"];
  const el = e.currentTarget;
  if (!isHTMLElement(el))
    return;
  const root = el.closest("[data-melt-toolbar]");
  if (!isHTMLElement(root))
    return;
  const items = Array.from(root.querySelectorAll("[data-melt-toolbar-item]"));
  const currentIndex = items.indexOf(el);
  if (e.key === nextKey) {
    e.preventDefault();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) {
      if ($options.loop) {
        handleRovingFocus(items[0]);
      }
    } else {
      handleRovingFocus(items[nextIndex]);
    }
  } else if (e.key === prevKey) {
    e.preventDefault();
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if ($options.loop) {
        handleRovingFocus(items[items.length - 1]);
      }
    } else {
      handleRovingFocus(items[prevIndex]);
    }
  } else if (e.key === kbd.HOME) {
    e.preventDefault();
    handleRovingFocus(items[0]);
  } else if (e.key === kbd.END) {
    e.preventDefault();
    handleRovingFocus(items[items.length - 1]);
  }
};
const Bold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 12a4 4 0 0 0 0-8H6v8m9 8a4 4 0 0 0 0-8H6v8Z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Strikethrough = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Bold as B,
  Strikethrough as S,
  createToolbar as c
};
